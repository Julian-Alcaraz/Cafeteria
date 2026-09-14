import { MigrationInterface, QueryRunner } from "typeorm";

export class AddAuditLogs1789322117316 implements MigrationInterface {
    name = 'AddAuditLogs1789322117316'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "audit_ignore_rules" ("id" SERIAL NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deshabilitado" boolean NOT NULL DEFAULT false, "routePattern" character varying NOT NULL, "isActive" boolean NOT NULL DEFAULT true, CONSTRAINT "UQ_985eacdd88317e74556e04ec818" UNIQUE ("routePattern"), CONSTRAINT "PK_52dfd65a560b29bf36a7d277a02" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "audit_logs" ("id" SERIAL NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deshabilitado" boolean NOT NULL DEFAULT false, "userId" integer, "method" character varying NOT NULL, "url" character varying NOT NULL, "requestPayload" jsonb, "responsePayload" jsonb, "statusCode" integer NOT NULL, "isSuccess" boolean NOT NULL, "executionTimeMs" integer NOT NULL, CONSTRAINT "PK_1bb179d048bbc581caa3b013439" PRIMARY KEY ("id"))`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "audit_logs"`);
        await queryRunner.query(`DROP TABLE "audit_ignore_rules"`);
    }

}
