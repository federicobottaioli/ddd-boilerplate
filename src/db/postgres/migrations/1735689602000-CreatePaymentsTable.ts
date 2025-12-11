import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreatePaymentsTable1735689602000 implements MigrationInterface {
    name = 'CreatePaymentsTable1735689602000';

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(
            `CREATE TABLE "payments" (
                "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
                "amount" decimal(10,2) NOT NULL,
                "currency" character varying(3) NOT NULL,
                "card_token" character varying(100) NOT NULL,
                "merchant_reference" character varying(100) NOT NULL,
                "customer_id" uuid NOT NULL,
                "payment_status_id" uuid NOT NULL,
                "metadata" jsonb,
                "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
                "updatedAt" TIMESTAMP NOT NULL DEFAULT now(),
                "deleted_at" TIMESTAMP,
                CONSTRAINT "PK_payments" PRIMARY KEY ("id")
            )`,
        );
        await queryRunner.query(`CREATE INDEX "IDX_payments_amount" ON "payments" ("amount")`);
        await queryRunner.query(`CREATE INDEX "IDX_payments_currency" ON "payments" ("currency")`);
        await queryRunner.query(`CREATE INDEX "IDX_payments_merchant_reference" ON "payments" ("merchant_reference")`);
        await queryRunner.query(`CREATE INDEX "IDX_payments_customer_id" ON "payments" ("customer_id")`);
        await queryRunner.query(`CREATE INDEX "IDX_payments_payment_status_id" ON "payments" ("payment_status_id")`);

        await queryRunner.query(
            `ALTER TABLE "payments" ADD CONSTRAINT "FK_payments_customer_id" FOREIGN KEY ("customer_id") REFERENCES "customers"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
        );
        await queryRunner.query(
            `ALTER TABLE "payments" ADD CONSTRAINT "FK_payments_payment_status_id" FOREIGN KEY ("payment_status_id") REFERENCES "payment_statuses"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "payments" DROP CONSTRAINT "FK_payments_payment_status_id"`);
        await queryRunner.query(`ALTER TABLE "payments" DROP CONSTRAINT "FK_payments_customer_id"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_payments_payment_status_id"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_payments_customer_id"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_payments_merchant_reference"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_payments_currency"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_payments_amount"`);
        await queryRunner.query(`DROP TABLE "payments"`);
    }
}
