import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateTransactionsTable1735689603000 implements MigrationInterface {
    name = 'CreateTransactionsTable1735689603000';

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(
            `CREATE TYPE "public"."transactions_type_enum" AS ENUM('AUTHORIZATION', 'CAPTURE', 'REFUND')`,
        );
        await queryRunner.query(
            `CREATE TYPE "public"."transactions_status_enum" AS ENUM('PENDING', 'SUCCESS', 'FAILED')`,
        );

        await queryRunner.query(
            `CREATE TABLE "transactions" (
                "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
                "payment_id" uuid NOT NULL,
                "type" "public"."transactions_type_enum" NOT NULL,
                "amount" decimal(10,2) NOT NULL,
                "status" "public"."transactions_status_enum" NOT NULL,
                "gateway_response" jsonb NOT NULL,
                "gateway_transaction_id" character varying(255),
                "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
                "updatedAt" TIMESTAMP NOT NULL DEFAULT now(),
                CONSTRAINT "PK_transactions" PRIMARY KEY ("id")
            )`,
        );
        await queryRunner.query(`CREATE INDEX "IDX_transactions_payment_id" ON "transactions" ("payment_id")`);
        await queryRunner.query(`CREATE INDEX "IDX_transactions_type" ON "transactions" ("type")`);
        await queryRunner.query(`CREATE INDEX "IDX_transactions_status" ON "transactions" ("status")`);
        await queryRunner.query(`CREATE INDEX "IDX_transactions_gateway_transaction_id" ON "transactions" ("gateway_transaction_id")`);

        await queryRunner.query(
            `ALTER TABLE "transactions" ADD CONSTRAINT "FK_transactions_payment_id" FOREIGN KEY ("payment_id") REFERENCES "payments"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "transactions" DROP CONSTRAINT "FK_transactions_payment_id"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_transactions_gateway_transaction_id"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_transactions_status"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_transactions_type"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_transactions_payment_id"`);
        await queryRunner.query(`DROP TABLE "transactions"`);
        await queryRunner.query(`DROP TYPE "public"."transactions_status_enum"`);
        await queryRunner.query(`DROP TYPE "public"."transactions_type_enum"`);
    }
}
