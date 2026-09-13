import { MigrationInterface, QueryRunner } from "typeorm";

export class AddBaseEntityColumns1789312608557 implements MigrationInterface {
    name = 'AddBaseEntityColumns1789312608557'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "permissions" ADD "createdAt" TIMESTAMP NOT NULL DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "permissions" ADD "updatedAt" TIMESTAMP NOT NULL DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "permissions" ADD "deshabilitado" boolean NOT NULL DEFAULT false`);
        await queryRunner.query(`ALTER TABLE "menus" ADD "createdAt" TIMESTAMP NOT NULL DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "menus" ADD "updatedAt" TIMESTAMP NOT NULL DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "menus" ADD "deshabilitado" boolean NOT NULL DEFAULT false`);
        await queryRunner.query(`ALTER TABLE "users" ADD "createdAt" TIMESTAMP NOT NULL DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "users" ADD "updatedAt" TIMESTAMP NOT NULL DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "users" ADD "deshabilitado" boolean NOT NULL DEFAULT false`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "deshabilitado"`);
        await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "updatedAt"`);
        await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "createdAt"`);
        await queryRunner.query(`ALTER TABLE "menus" DROP COLUMN "deshabilitado"`);
        await queryRunner.query(`ALTER TABLE "menus" DROP COLUMN "updatedAt"`);
        await queryRunner.query(`ALTER TABLE "menus" DROP COLUMN "createdAt"`);
        await queryRunner.query(`ALTER TABLE "permissions" DROP COLUMN "deshabilitado"`);
        await queryRunner.query(`ALTER TABLE "permissions" DROP COLUMN "updatedAt"`);
        await queryRunner.query(`ALTER TABLE "permissions" DROP COLUMN "createdAt"`);
    }

}
