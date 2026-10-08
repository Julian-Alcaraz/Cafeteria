import { MigrationInterface, QueryRunner } from "typeorm";

export class Sprint3POS1791397716586 implements MigrationInterface {
    name = 'Sprint3POS1791397716586'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TYPE "public"."accounts_status_enum" AS ENUM('OPEN', 'CLOSED', 'CANCELLED')`);
        await queryRunner.query(`CREATE TABLE "accounts" ("id" SERIAL NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deshabilitado" boolean NOT NULL DEFAULT false, "customerName" character varying(100), "status" "public"."accounts_status_enum" NOT NULL DEFAULT 'OPEN', "totalAmount" numeric(10,2) NOT NULL DEFAULT '0', "paymentMethodInfo" character varying(255), "tip" numeric(10,2) NOT NULL DEFAULT '0', "tableId" integer, CONSTRAINT "PK_5a7a02c20412299d198e097a8fe" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TYPE "public"."account_items_status_enum" AS ENUM('PENDING', 'DELIVERED', 'CANCELLED')`);
        await queryRunner.query(`CREATE TABLE "account_items" ("id" SERIAL NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deshabilitado" boolean NOT NULL DEFAULT false, "account_id" integer NOT NULL, "product_id" integer NOT NULL, "price" numeric(10,2) NOT NULL, "quantity" numeric(10,4) NOT NULL, "status" "public"."account_items_status_enum" NOT NULL DEFAULT 'PENDING', "isComplimentary" boolean NOT NULL DEFAULT false, "complimentaryReason" character varying(255), "remadeQuantity" numeric(10,4) NOT NULL DEFAULT '0', "hopper_id" integer, CONSTRAINT "PK_48eecc56369c7a40caecc6ae0ff" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "account_items" ADD CONSTRAINT "FK_b3edbec30aacb2575946246829d" FOREIGN KEY ("account_id") REFERENCES "accounts"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "account_items" ADD CONSTRAINT "FK_409a8d7050ba720ab21391f9707" FOREIGN KEY ("product_id") REFERENCES "products"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "account_items" ADD CONSTRAINT "FK_73da2ca7d31c9065ff052ecf469" FOREIGN KEY ("hopper_id") REFERENCES "hopper_configs"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "account_items" DROP CONSTRAINT "FK_73da2ca7d31c9065ff052ecf469"`);
        await queryRunner.query(`ALTER TABLE "account_items" DROP CONSTRAINT "FK_409a8d7050ba720ab21391f9707"`);
        await queryRunner.query(`ALTER TABLE "account_items" DROP CONSTRAINT "FK_b3edbec30aacb2575946246829d"`);
        await queryRunner.query(`DROP TABLE "account_items"`);
        await queryRunner.query(`DROP TYPE "public"."account_items_status_enum"`);
        await queryRunner.query(`DROP TABLE "accounts"`);
        await queryRunner.query(`DROP TYPE "public"."accounts_status_enum"`);
    }

}
