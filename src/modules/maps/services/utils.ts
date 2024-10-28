import { GoogleMapDirectionsRequest } from './dtos/providers/google-map/gg-map-directions-request';
import { MapBoxDirectionsRequest } from './dtos/providers/mapbox/mapbox-directions-request';
import { IDirectionsRequest } from './dtos/directions-request.interface';
import { DataSource } from 'typeorm';

export type BulkCoordinationsPreprocessResponse = {
  path_order: number;
  point_type: string;
  lng: number;
  lat: number;
  waypoint_index: number | null;
};

export async function bulkPreprocessCoordinations(
  request:
    | MapBoxDirectionsRequest
    | GoogleMapDirectionsRequest
    | IDirectionsRequest,
  dataSource: DataSource,
): Promise<BulkCoordinationsPreprocessResponse[]> {
  const { origin, destination, waypoints } = request.params;
  const get_optimal_path_sql = `
    -- Recursive CTE to find optimal path
    WITH RECURSIVE sorted_path AS (
        -- Base case: start with origin
        SELECT
            id,
            point_type,
            geom,
            1 as path_order,
            ARRAY[id] as visited_points
        FROM temp_waypoints
        WHERE point_type = 'origin'

        UNION ALL

        -- Recursive case: find next nearest point
        SELECT
            w.id,
            w.point_type,
            w.geom,
            sp.path_order + 1,
            sp.visited_points || w.id
        FROM sorted_path sp
        CROSS JOIN LATERAL (
            SELECT
                tw.id,
                tw.point_type,
                tw.geom
            FROM temp_waypoints tw
            WHERE tw.id != ALL(sp.visited_points)
            AND (
                tw.point_type != 'destination'
                OR NOT EXISTS (
                    SELECT 1
                    FROM temp_waypoints tw2
                    WHERE tw2.id != ALL(sp.visited_points)
                    AND tw2.point_type = 'waypoint'
                )
            )
            ORDER BY
                CASE
                    WHEN tw.point_type = 'destination' AND EXISTS (
                        SELECT 1
                        FROM temp_waypoints tw2
                        WHERE tw2.id != ALL(sp.visited_points)
                        AND tw2.point_type = 'waypoint'
                    ) THEN 2
                    ELSE 1
                END,
                sp.geom <-> tw.geom
            LIMIT 1
        ) w
    )

    -- Final result with coordinates
    SELECT
        sp.path_order,
        sp.point_type,
        ST_X(sp.geom) as lng,
        ST_Y(sp.geom) as lat,
        CASE
            WHEN sp.point_type = 'waypoint'
            THEN sp.path_order - 2  -- Subtract 2 to account for origin being 1
            ELSE NULL
        END as waypoint_index
    FROM sorted_path sp
    ORDER BY sp.path_order;
  `;
  const queryRunner = dataSource.createQueryRunner();

  try {
    await queryRunner.connect();
    await queryRunner.startTransaction();

    // create a temporary table to store waypoints for better performance
    await queryRunner.query(`
        CREATE TEMPORARY TABLE IF NOT EXISTS temp_waypoints (
          id SERIAL PRIMARY KEY,
          point_type VARCHAR(20),
          geom GEOMETRY(Point, 4326)
        )
      `);

    // insert origin point
    await queryRunner.query(`
        INSERT INTO temp_waypoints (point_type, geom)
        VALUES (
          'origin',
          ST_SetSRID(ST_MakePoint(${origin.lng}, ${origin.lat}), 4326)
        )
      `);

    // insert waypoints from JSON
    await queryRunner.query(`
        INSERT INTO temp_waypoints (point_type, geom)
        SELECT
          'waypoint' as point_type,
          ST_SetSRID(ST_MakePoint(lng, lat), 4326) as geom
        FROM jsonb_to_recordset('${JSON.stringify(
          waypoints,
        )}') as waypoints(lat float, lng float)
      `);

    // insert destination point
    await queryRunner.query(`
        INSERT INTO temp_waypoints (point_type, geom)
        VALUES (
          'destination',
          ST_SetSRID(ST_MakePoint(${destination.lng}, ${destination.lat}), 4326)
        )
      `);

    // create index for better spatial query performance
    await queryRunner.query(`
        CREATE INDEX IF NOT EXISTS idx_temp_waypoints_geom ON temp_waypoints USING GIST(geom)
      `);

    // recursive CTE to find optimal path
    const result = await queryRunner.query(get_optimal_path_sql);

    // clean up
    await queryRunner.query('DROP TABLE IF EXISTS temp_waypoints');
    await queryRunner.query('DROP INDEX IF EXISTS idx_temp_waypoints_geom');
    await queryRunner.commitTransaction();

    return result;
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('Error executing SQL script:', error);
    return null;
  }
}
