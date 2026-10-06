import { MigrationInterface, QueryRunner } from "typeorm";

export class CatalogAndRecipes1790000000001 implements MigrationInterface {
    name = 'CatalogAndRecipes1790000000001'

    public async up(queryRunner: QueryRunner): Promise<void> {
        // ── CATÁLOGO ──────────────────────────────────────────────────────────────

        await queryRunner.query(`
            CREATE TABLE "product_types" (
                "id" SERIAL NOT NULL,
                "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
                "updatedAt" TIMESTAMP NOT NULL DEFAULT now(),
                "deshabilitado" boolean NOT NULL DEFAULT false,
                "code" character varying NOT NULL,
                "name" character varying NOT NULL,
                CONSTRAINT "UQ_product_types_code" UNIQUE ("code"),
                CONSTRAINT "PK_product_types" PRIMARY KEY ("id")
            )
        `);

        await queryRunner.query(`
            CREATE TABLE "categories" (
                "id" SERIAL NOT NULL,
                "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
                "updatedAt" TIMESTAMP NOT NULL DEFAULT now(),
                "deshabilitado" boolean NOT NULL DEFAULT false,
                "name" character varying NOT NULL,
                "slug" character varying NOT NULL,
                "parentId" integer,
                CONSTRAINT "UQ_categories_slug" UNIQUE ("slug"),
                CONSTRAINT "PK_categories" PRIMARY KEY ("id")
            )
        `);

        await queryRunner.query(`
            ALTER TABLE "categories"
            ADD CONSTRAINT "FK_categories_parent"
            FOREIGN KEY ("parentId") REFERENCES "categories"("id")
            ON DELETE SET NULL
        `);

        await queryRunner.query(`
            CREATE TABLE "products" (
                "id" SERIAL NOT NULL,
                "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
                "updatedAt" TIMESTAMP NOT NULL DEFAULT now(),
                "deshabilitado" boolean NOT NULL DEFAULT false,
                "sku" character varying,
                "name" character varying NOT NULL,
                "description" character varying,
                "productTypeId" integer NOT NULL,
                "categoryId" integer,
                "unit" character varying NOT NULL DEFAULT 'UNIT',
                "costPrice" numeric(10,4) NOT NULL DEFAULT 0,
                "salePrice" numeric(10,4) NOT NULL DEFAULT 0,
                "trackStock" boolean NOT NULL DEFAULT true,
                "isSoldByWeight" boolean NOT NULL DEFAULT false,
                CONSTRAINT "UQ_products_sku" UNIQUE ("sku"),
                CONSTRAINT "PK_products" PRIMARY KEY ("id")
            )
        `);

        await queryRunner.query(`
            ALTER TABLE "products"
            ADD CONSTRAINT "FK_products_productType"
            FOREIGN KEY ("productTypeId") REFERENCES "product_types"("id")
        `);

        await queryRunner.query(`
            ALTER TABLE "products"
            ADD CONSTRAINT "FK_products_category"
            FOREIGN KEY ("categoryId") REFERENCES "categories"("id")
            ON DELETE SET NULL
        `);

        await queryRunner.query(`
            CREATE TABLE "coffee_varieties" (
                "id" SERIAL NOT NULL,
                "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
                "updatedAt" TIMESTAMP NOT NULL DEFAULT now(),
                "deshabilitado" boolean NOT NULL DEFAULT false,
                "productId" integer NOT NULL,
                "origin" character varying NOT NULL,
                "process" character varying,
                "roastLevel" character varying,
                "notes" character varying,
                CONSTRAINT "UQ_coffee_varieties_product" UNIQUE ("productId"),
                CONSTRAINT "PK_coffee_varieties" PRIMARY KEY ("id")
            )
        `);

        await queryRunner.query(`
            ALTER TABLE "coffee_varieties"
            ADD CONSTRAINT "FK_coffee_varieties_product"
            FOREIGN KEY ("productId") REFERENCES "products"("id")
            ON DELETE CASCADE
        `);

        // ── RECETAS ───────────────────────────────────────────────────────────────

        await queryRunner.query(`
            CREATE TABLE "recipes" (
                "id" SERIAL NOT NULL,
                "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
                "updatedAt" TIMESTAMP NOT NULL DEFAULT now(),
                "deshabilitado" boolean NOT NULL DEFAULT false,
                "productId" integer NOT NULL,
                "name" character varying NOT NULL,
                "version" integer NOT NULL DEFAULT 1,
                "isActive" boolean NOT NULL DEFAULT true,
                "yieldQty" numeric(10,4) NOT NULL DEFAULT 1,
                "yieldUnit" character varying NOT NULL DEFAULT 'UNIT',
                "validFrom" TIMESTAMP NOT NULL DEFAULT now(),
                CONSTRAINT "PK_recipes" PRIMARY KEY ("id")
            )
        `);

        await queryRunner.query(`
            ALTER TABLE "recipes"
            ADD CONSTRAINT "FK_recipes_product"
            FOREIGN KEY ("productId") REFERENCES "products"("id")
            ON DELETE CASCADE
        `);

        await queryRunner.query(`
            CREATE TABLE "recipe_ingredients" (
                "id" SERIAL NOT NULL,
                "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
                "updatedAt" TIMESTAMP NOT NULL DEFAULT now(),
                "deshabilitado" boolean NOT NULL DEFAULT false,
                "recipeId" integer NOT NULL,
                "productId" integer NOT NULL,
                "quantity" numeric(10,4) NOT NULL,
                "unit" character varying NOT NULL DEFAULT 'UNIT',
                "isHopperSlot" boolean NOT NULL DEFAULT false,
                "hopperSlotNumber" integer,
                "notes" character varying,
                CONSTRAINT "PK_recipe_ingredients" PRIMARY KEY ("id")
            )
        `);

        await queryRunner.query(`
            ALTER TABLE "recipe_ingredients"
            ADD CONSTRAINT "FK_recipe_ingredients_recipe"
            FOREIGN KEY ("recipeId") REFERENCES "recipes"("id")
            ON DELETE CASCADE
        `);

        await queryRunner.query(`
            ALTER TABLE "recipe_ingredients"
            ADD CONSTRAINT "FK_recipe_ingredients_product"
            FOREIGN KEY ("productId") REFERENCES "products"("id")
        `);

        // ── ÍNDICES ───────────────────────────────────────────────────────────────

        await queryRunner.query(`CREATE INDEX "IDX_products_productType" ON "products" ("productTypeId")`);
        await queryRunner.query(`CREATE INDEX "IDX_products_category" ON "products" ("categoryId")`);
        await queryRunner.query(`CREATE INDEX "IDX_recipes_product" ON "recipes" ("productId")`);
        await queryRunner.query(`CREATE INDEX "IDX_recipes_active" ON "recipes" ("productId", "isActive")`);
        await queryRunner.query(`CREATE INDEX "IDX_recipe_ingredients_recipe" ON "recipe_ingredients" ("recipeId")`);

        // ── SEED: tipos de producto ───────────────────────────────────────────────

        await queryRunner.query(`
            INSERT INTO "product_types" ("code", "name") VALUES
                ('SALEABLE',   'Venta directa'),
                ('INGREDIENT', 'Insumo'),
                ('ELABORATED', 'Elaborado'),
                ('COFFEE_BEAN','Café en grano')
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE IF EXISTS "recipe_ingredients"`);
        await queryRunner.query(`DROP TABLE IF EXISTS "recipes"`);
        await queryRunner.query(`DROP TABLE IF EXISTS "coffee_varieties"`);
        await queryRunner.query(`DROP TABLE IF EXISTS "products"`);
        await queryRunner.query(`DROP TABLE IF EXISTS "categories"`);
        await queryRunner.query(`DROP TABLE IF EXISTS "product_types"`);
    }
}
