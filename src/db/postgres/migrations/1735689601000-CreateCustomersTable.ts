import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateCustomersTable1735689601000 implements MigrationInterface {
    name = 'CreateCustomersTable1735689601000';

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(
            `CREATE TABLE "customers" (
                "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
                "name" character varying(200) NOT NULL,
                "email" character varying(255) NOT NULL,
                "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
                "updatedAt" TIMESTAMP NOT NULL DEFAULT now(),
                "deleted_at" TIMESTAMP,
                CONSTRAINT "PK_customers" PRIMARY KEY ("id"),
                CONSTRAINT "UQ_customers_email" UNIQUE ("email")
            )`,
        );
        await queryRunner.query(`CREATE INDEX "IDX_customers_name" ON "customers" ("name")`);
        await queryRunner.query(`CREATE INDEX "IDX_customers_email" ON "customers" ("email")`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP INDEX "public"."IDX_customers_email"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_customers_name"`);
        await queryRunner.query(`DROP TABLE "customers"`);
    }
}
