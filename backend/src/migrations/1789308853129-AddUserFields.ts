import { MigrationInterface, QueryRunner } from "typeorm";

export class AddUserFields1789308853129 implements MigrationInterface {
    name = 'AddUserFields1789308853129'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "users" ADD "email" character varying`);
        await queryRunner.query(`ALTER TABLE "users" ADD "telefono" character varying`);
        await queryRunner.query(`ALTER TABLE "users" ADD "nombre" character varying`);
        await queryRunner.query(`ALTER TABLE "users" ADD "apellido" character varying`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "apellido"`);
        await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "nombre"`);
        await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "telefono"`);
        await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "email"`);
    }

}
