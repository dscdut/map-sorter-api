import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateRoutesTable1710411881344 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            CREATE TABLE IF NOT EXISTS routes (
                id uuid NOT NULL DEFAULT uuid_generate_v4(),
                name character varying NOT NULL,
                path_display text,
                provider character varying NOT NULL,
                user_id uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
                created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
                PRIMARY KEY (id)
            )
        `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query('DROP TABLE IF EXISTS routes');
  }
}
