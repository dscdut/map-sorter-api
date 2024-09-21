import { IDirectionsResponse } from '../../directions-response.interface';

export interface WaypointsResponseData {
  distance?: number;
  name?: string;
  location: [number, number];
  waypoint_index: number;
}

export class MapBoxDirectionsResponse implements IDirectionsResponse {
  data: {
    status: string;
    routes: {
      waypoints?: WaypointsResponseData;
      legs: [];
      overview_polyline: string;
    }[];
  };
}
