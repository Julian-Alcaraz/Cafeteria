import { MigrationInterface, QueryRunner } from "typeorm";

export class SeedCatalogMenus1789910977658 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        // Insertar permisos nuevos
        await queryRunner.query(`
            INSERT INTO "permissions" (name, description) VALUES
            ('manage_catalog', 'Administrar el catálogo de productos y categorías'),
            ('manage_recipes', 'Administrar recetas e ingredientes')
        `);

        // Obtener los IDs insertados
        const permCatalog = await queryRunner.query(`SELECT id FROM permissions WHERE name = 'manage_catalog' LIMIT 1`);
        const permRecipes = await queryRunner.query(`SELECT id FROM permissions WHERE name = 'manage_recipes' LIMIT 1`);
        const idCatalog = permCatalog[0].id;
        const idRecipes = permRecipes[0].id;

        // Insertar Menús nuevos
        await queryRunner.query(`
            INSERT INTO "menus" (label, icon, url, parent_id, permission_id) VALUES
            ('Catálogo', 'pi pi-book', '/app/catalogo', null, ${idCatalog}),
            ('Recetas', 'pi pi-receipt', '/app/recetas', null, ${idRecipes})
        `);

        // Asignar los permisos al superadmin si existe
        // Buscamos si existe algun superadmin o admin
        const admins = await queryRunner.query(`SELECT id FROM users WHERE username = 'superadmin' OR username = 'admin' LIMIT 1`);
        if (admins.length > 0) {
            const adminId = admins[0].id;
            await queryRunner.query(`
                INSERT INTO "user_permissions" (user_id, permission_id) VALUES
                (${adminId}, ${idCatalog}),
                (${adminId}, ${idRecipes})
                ON CONFLICT DO NOTHING
            `);
        }
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DELETE FROM "menus" WHERE url IN ('/app/catalogo', '/app/recetas')`);
        await queryRunner.query(`DELETE FROM "permissions" WHERE name IN ('manage_catalog', 'manage_recipes')`);
    }

}
