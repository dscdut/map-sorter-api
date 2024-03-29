import { MigrationInterface, QueryRunner } from 'typeorm';

export class ChangePathDisplayColumnDatatypeToJson1711702779635
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            ALTER TABLE routes
            ALTER COLUMN path_display
            SET DATA TYPE json
            USING path_display::json
        `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            ALTER TABLE routes
            ALTER COLUMN path_display
            SET DATA TYPE text
            USING path_display::text
        `);
  }
}
