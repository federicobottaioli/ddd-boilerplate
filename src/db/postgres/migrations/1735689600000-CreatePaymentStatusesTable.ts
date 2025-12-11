import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreatePaymentStatusesTable1735689600000 implements MigrationInterface {
    name = 'CreatePaymentStatusesTable1735689600000';

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(
            `CREATE TABLE "payment_statuses" (
                "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
                "name" character varying(100) NOT NULL,
                "description" text,
                "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
                "updatedAt" TIMESTAMP NOT NULL DEFAULT now(),
                "deleted_at" TIMESTAMP,
                CONSTRAINT "PK_payment_statuses" PRIMARY KEY ("id"),
                CONSTRAINT "UQ_payment_statuses_name" UNIQUE ("name")
            )`,
        );
        await queryRunner.query(`CREATE INDEX "IDX_payment_statuses_name" ON "payment_statuses" ("name")`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP INDEX "public"."IDX_payment_statuses_name"`);
        await queryRunner.query(`DROP TABLE "payment_statuses"`);
    }
}
