import { MigrationInterface, QueryRunner } from "typeorm";

export class SeedPOSMenu1791401654941 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            INSERT INTO "permissions" (name, description) VALUES
            ('use_pos', 'Usar el Punto de Venta')
        `);

        const users = await queryRunner.query(`SELECT id FROM "users" WHERE email = 'admin@admin.com'`);
        if (users.length > 0) {
            const adminId = users[0].id;
            const perms = await queryRunner.query(`SELECT id FROM "permissions" WHERE name = 'use_pos'`);
            for (const p of perms) {
                await queryRunner.query(`INSERT INTO "user_permissions" ("userId", "permissionId") VALUES (${adminId}, ${p.id})`);
            }
        }

        const p1 = await queryRunner.query(`SELECT id FROM "permissions" WHERE name = 'use_pos'`);
        await queryRunner.query(`
            INSERT INTO "menus" (label, icon, url, "parent_id", "permission_id") VALUES
            ('Punto de Venta', 'pi pi-desktop', '/app/pos', null, ${p1[0].id})
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DELETE FROM "menus" WHERE url = '/app/pos'`);
        await queryRunner.query(`DELETE FROM "permissions" WHERE name = 'use_pos'`);
    }

}
