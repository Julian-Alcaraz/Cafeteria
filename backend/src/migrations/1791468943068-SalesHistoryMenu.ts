import { MigrationInterface, QueryRunner } from "typeorm";

export class SalesHistoryMenu1791468943068 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<void> {
        // Insert permission for viewing sales history
        await queryRunner.query(`
            INSERT INTO "permissions" (name, description) VALUES
            ('view_sales', 'Ver historial de ventas')
        `);

        // Assign to admin
        const users = await queryRunner.query(`SELECT id FROM "users" WHERE email = 'admin@admin.com'`);
        if (users.length > 0) {
            const adminId = users[0].id;
            const perms = await queryRunner.query(`SELECT id FROM "permissions" WHERE name = 'view_sales'`);
            for (const p of perms) {
                await queryRunner.query(`INSERT INTO "user_permissions" ("userId", "permissionId") VALUES (${adminId}, ${p.id})`);
            }
        }

        const p1 = await queryRunner.query(`SELECT id FROM "permissions" WHERE name = 'view_sales'`);
        
        // Ensure "Administración" parent menu exists
        let adminMenu = await queryRunner.query(`SELECT id FROM "menus" WHERE label = 'Administración'`);
        if (adminMenu.length === 0) {
            await queryRunner.query(`
                INSERT INTO "menus" (label, icon, url) VALUES
                ('Administración', 'pi pi-briefcase', null)
            `);
            adminMenu = await queryRunner.query(`SELECT id FROM "menus" WHERE label = 'Administración'`);
        }

        const parentId = adminMenu[0].id;

        // Insert "Ventas" menu under "Administración"
        await queryRunner.query(`
            INSERT INTO "menus" (label, icon, url, "parent_id", "permission_id") VALUES
            ('Ventas', 'pi pi-chart-line', '/app/pos/sales', ${parentId}, ${p1[0].id})
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DELETE FROM "menus" WHERE url = '/app/pos/sales'`);
        await queryRunner.query(`DELETE FROM "permissions" WHERE name = 'view_sales'`);
    }
}
