import { MigrationInterface, QueryRunner } from 'typeorm';

export class SeedHoppersInventoryMenus1791380000000 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    // Permisos
    await queryRunner.query(`
      INSERT INTO "permissions" (name, description) VALUES
      ('manage_hoppers', 'Configurar Tolvas de Café'),
      ('view_inventory', 'Ver inventario de stock'),
      ('manage_purchases', 'Gestionar órdenes de compra')
    `);

    const adminRole = await queryRunner.query(`SELECT id FROM "permissions" WHERE name = 'manage_hoppers'`); // Wait, roles are implicit or direct?
    // Actually in Sprint 1 we gave permissions directly to the superadmin user.
    // Let's get superadmin user
    const users = await queryRunner.query(`SELECT id FROM "users" WHERE email = 'admin@admin.com'`);
    if (users.length > 0) {
      const adminId = users[0].id;
      const perms = await queryRunner.query(`SELECT id FROM "permissions" WHERE name IN ('manage_hoppers', 'view_inventory', 'manage_purchases')`);
      for (const p of perms) {
        await queryRunner.query(`INSERT INTO "user_permissions" ("userId", "permissionId") VALUES (${adminId}, ${p.id})`);
      }
    }

    // Menús
    // 1. Tolvas
    const p1 = await queryRunner.query(`SELECT id FROM "permissions" WHERE name = 'manage_hoppers'`);
    await queryRunner.query(`
      INSERT INTO "menus" (label, icon, url, "parent_id", "permission_id") VALUES
      ('Tolvas', 'pi pi-cog', '/app/tolvas', null, ${p1[0].id})
    `);

    // 2. Inventario (Padre) -> This will hold Stock and Purchases
    await queryRunner.query(`
      INSERT INTO "menus" (label, icon, url, "parent_id", "permission_id") VALUES
      ('Inventario', 'pi pi-box', '/app/inventario', null, null)
    `);

    const invMenu = await queryRunner.query(`SELECT id FROM "menus" WHERE label = 'Inventario' AND "parent_id" IS NULL`);
    const p2 = await queryRunner.query(`SELECT id FROM "permissions" WHERE name = 'view_inventory'`);
    const p3 = await queryRunner.query(`SELECT id FROM "permissions" WHERE name = 'manage_purchases'`);

    await queryRunner.query(`
      INSERT INTO "menus" (label, icon, url, "parent_id", "permission_id") VALUES
      ('Stock Actual', 'pi pi-list', '/app/inventario/stock', ${invMenu[0].id}, ${p2[0].id}),
      ('Órdenes de Compra', 'pi pi-shopping-cart', '/app/inventario/compras', ${invMenu[0].id}, ${p3[0].id}),
      ('Proveedores', 'pi pi-users', '/app/inventario/proveedores', ${invMenu[0].id}, ${p3[0].id})
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DELETE FROM "menus" WHERE url LIKE '/app/inventario%'`);
    await queryRunner.query(`DELETE FROM "menus" WHERE url = '/app/inventario'`);
    await queryRunner.query(`DELETE FROM "menus" WHERE url = '/app/tolvas'`);
    await queryRunner.query(`DELETE FROM "permissions" WHERE name IN ('manage_hoppers', 'view_inventory', 'manage_purchases')`);
  }
}
