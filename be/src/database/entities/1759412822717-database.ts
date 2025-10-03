import { MigrationInterface, QueryRunner } from 'typeorm';

export class Database1759412822717 implements MigrationInterface {
  name = 'Database1759412822717';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "bookings" ADD "totalAmount" numeric(10,2) NOT NULL DEFAULT '0'`,
    );
    await queryRunner.query(
      `ALTER TABLE "bookings" ADD "updatedAt" TIMESTAMP NOT NULL DEFAULT now()`,
    );
    await queryRunner.query(`ALTER TABLE "events" ADD "price" numeric(10,2) NOT NULL DEFAULT '0'`);
    await queryRunner.query(`ALTER TABLE "events" ADD "location" character varying(255)`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "events" DROP COLUMN "location"`);
    await queryRunner.query(`ALTER TABLE "events" DROP COLUMN "price"`);
    await queryRunner.query(`ALTER TABLE "bookings" DROP COLUMN "updatedAt"`);
    await queryRunner.query(`ALTER TABLE "bookings" DROP COLUMN "totalAmount"`);
  }
}
