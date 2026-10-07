import { MigrationInterface, QueryRunner } from "typeorm";

export class Sprint21791379763810 implements MigrationInterface {
    name = 'Sprint21791379763810'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "products" DROP CONSTRAINT "FK_products_productType"`);
        await queryRunner.query(`ALTER TABLE "products" DROP CONSTRAINT "FK_products_category"`);
        await queryRunner.query(`ALTER TABLE "coffee_varieties" DROP CONSTRAINT "FK_coffee_varieties_product"`);
        await queryRunner.query(`ALTER TABLE "categories" DROP CONSTRAINT "FK_categories_parent"`);
        await queryRunner.query(`ALTER TABLE "recipe_ingredients" DROP CONSTRAINT "FK_recipe_ingredients_recipe"`);
        await queryRunner.query(`ALTER TABLE "recipe_ingredients" DROP CONSTRAINT "FK_recipe_ingredients_product"`);
        await queryRunner.query(`ALTER TABLE "recipes" DROP CONSTRAINT "FK_recipes_product"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_products_productType"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_products_category"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_recipe_ingredients_recipe"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_recipes_product"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_recipes_active"`);
        await queryRunner.query(`CREATE TABLE "stocks" ("id" SERIAL NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deshabilitado" boolean NOT NULL DEFAULT false, "productId" integer NOT NULL, "quantityAvailable" numeric(10,4) NOT NULL DEFAULT '0', "quantityReserved" numeric(10,4) NOT NULL DEFAULT '0', "unit" character varying NOT NULL, CONSTRAINT "UQ_3024bbca6232c8b6efa3ff51028" UNIQUE ("productId"), CONSTRAINT "REL_3024bbca6232c8b6efa3ff5102" UNIQUE ("productId"), CONSTRAINT "PK_b5b1ee4ac914767229337974575" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "suppliers" ("id" SERIAL NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deshabilitado" boolean NOT NULL DEFAULT false, "name" character varying NOT NULL, "taxId" character varying, "contactName" character varying, "email" character varying, "phone" character varying, CONSTRAINT "PK_b70ac51766a9e3144f778cfe81e" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "hopper_configs" ("id" SERIAL NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deshabilitado" boolean NOT NULL DEFAULT false, "configDate" date NOT NULL, "slotNumber" integer NOT NULL, "productId" integer NOT NULL, "configuredByUserId" integer NOT NULL, "isActive" boolean NOT NULL DEFAULT true, CONSTRAINT "PK_031aef3671d4a72d66208e65e23" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "purchase_order_items" ("id" SERIAL NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deshabilitado" boolean NOT NULL DEFAULT false, "purchaseOrderId" integer NOT NULL, "productId" integer NOT NULL, "quantity" numeric(10,4) NOT NULL, "unitCost" numeric(10,4) NOT NULL, "receivedQty" numeric(10,4) NOT NULL DEFAULT '0', "unit" character varying NOT NULL, CONSTRAINT "PK_e8b7568d25c41e3290db596b312" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "purchase_orders" ("id" SERIAL NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deshabilitado" boolean NOT NULL DEFAULT false, "code" character varying NOT NULL, "supplierId" integer NOT NULL, "status" character varying NOT NULL DEFAULT 'DRAFT', "totalAmount" numeric(12,2) NOT NULL DEFAULT '0', "orderedAt" date, "expectedAt" date, "receivedAt" date, "createdByUserId" integer NOT NULL, CONSTRAINT "UQ_f96c29600a09115dd4f136ab41a" UNIQUE ("code"), CONSTRAINT "PK_05148947415204a897e8beb2553" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "stock_lots" ("id" SERIAL NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deshabilitado" boolean NOT NULL DEFAULT false, "productId" integer NOT NULL, "purchaseOrderItemId" integer, "lotNumber" character varying, "initialQty" numeric(10,4) NOT NULL, "remainingQty" numeric(10,4) NOT NULL, "unitCost" numeric(10,4) NOT NULL, "expiryDate" date, CONSTRAINT "PK_578c4d59145e7d590780f29347b" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "stock_movements" ("id" SERIAL NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deshabilitado" boolean NOT NULL DEFAULT false, "productId" integer NOT NULL, "stockLotId" integer, "type" character varying NOT NULL, "quantity" numeric(10,4) NOT NULL, "unitCost" numeric(10,4), "referenceType" character varying NOT NULL, "referenceId" integer, "performedByUserId" integer NOT NULL, "notes" character varying, CONSTRAINT "PK_57a26b190618550d8e65fb860e7" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "products" ADD CONSTRAINT "FK_fed065ae1a8b80a37a9230da1fa" FOREIGN KEY ("productTypeId") REFERENCES "product_types"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "products" ADD CONSTRAINT "FK_ff56834e735fa78a15d0cf21926" FOREIGN KEY ("categoryId") REFERENCES "categories"("id") ON DELETE SET NULL ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "stocks" ADD CONSTRAINT "FK_3024bbca6232c8b6efa3ff51028" FOREIGN KEY ("productId") REFERENCES "products"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "coffee_varieties" ADD CONSTRAINT "FK_cd481b68df525b2cbc119f84520" FOREIGN KEY ("productId") REFERENCES "products"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "categories" ADD CONSTRAINT "FK_9a6f051e66982b5f0318981bcaa" FOREIGN KEY ("parentId") REFERENCES "categories"("id") ON DELETE SET NULL ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "recipe_ingredients" ADD CONSTRAINT "FK_2d7f407ae694e91bb3da1798c61" FOREIGN KEY ("recipeId") REFERENCES "recipes"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "recipe_ingredients" ADD CONSTRAINT "FK_ae8e29989e9108f27cf7198e606" FOREIGN KEY ("productId") REFERENCES "products"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "hopper_configs" ADD CONSTRAINT "FK_edeb3236fba7a5b64e426ad066d" FOREIGN KEY ("productId") REFERENCES "products"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "hopper_configs" ADD CONSTRAINT "FK_1ad16efb11a95ce5a1c2ef3c34a" FOREIGN KEY ("configuredByUserId") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "recipes" ADD CONSTRAINT "FK_67c6c6236c69cf0173a89083485" FOREIGN KEY ("productId") REFERENCES "products"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "purchase_order_items" ADD CONSTRAINT "FK_1de7eb246940b05765d2c99a7ec" FOREIGN KEY ("purchaseOrderId") REFERENCES "purchase_orders"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "purchase_order_items" ADD CONSTRAINT "FK_f87b1b82a3aff16d1cb5e49a656" FOREIGN KEY ("productId") REFERENCES "products"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "purchase_orders" ADD CONSTRAINT "FK_0c3ff892a9f2ed16f59d31cccae" FOREIGN KEY ("supplierId") REFERENCES "suppliers"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "purchase_orders" ADD CONSTRAINT "FK_5e0069b01003c73a904f0e4d97b" FOREIGN KEY ("createdByUserId") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "stock_lots" ADD CONSTRAINT "FK_10283ab43e20af849410647fa91" FOREIGN KEY ("productId") REFERENCES "products"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "stock_lots" ADD CONSTRAINT "FK_8be276a611a30e1cd2330d85181" FOREIGN KEY ("purchaseOrderItemId") REFERENCES "purchase_order_items"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "stock_movements" ADD CONSTRAINT "FK_a3acb59db67e977be45e382fc56" FOREIGN KEY ("productId") REFERENCES "products"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "stock_movements" ADD CONSTRAINT "FK_9d1bc708b9860941ef864a30050" FOREIGN KEY ("stockLotId") REFERENCES "stock_lots"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "stock_movements" ADD CONSTRAINT "FK_643d4e93a838bb9920a716a8950" FOREIGN KEY ("performedByUserId") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "stock_movements" DROP CONSTRAINT "FK_643d4e93a838bb9920a716a8950"`);
        await queryRunner.query(`ALTER TABLE "stock_movements" DROP CONSTRAINT "FK_9d1bc708b9860941ef864a30050"`);
        await queryRunner.query(`ALTER TABLE "stock_movements" DROP CONSTRAINT "FK_a3acb59db67e977be45e382fc56"`);
        await queryRunner.query(`ALTER TABLE "stock_lots" DROP CONSTRAINT "FK_8be276a611a30e1cd2330d85181"`);
        await queryRunner.query(`ALTER TABLE "stock_lots" DROP CONSTRAINT "FK_10283ab43e20af849410647fa91"`);
        await queryRunner.query(`ALTER TABLE "purchase_orders" DROP CONSTRAINT "FK_5e0069b01003c73a904f0e4d97b"`);
        await queryRunner.query(`ALTER TABLE "purchase_orders" DROP CONSTRAINT "FK_0c3ff892a9f2ed16f59d31cccae"`);
        await queryRunner.query(`ALTER TABLE "purchase_order_items" DROP CONSTRAINT "FK_f87b1b82a3aff16d1cb5e49a656"`);
        await queryRunner.query(`ALTER TABLE "purchase_order_items" DROP CONSTRAINT "FK_1de7eb246940b05765d2c99a7ec"`);
        await queryRunner.query(`ALTER TABLE "recipes" DROP CONSTRAINT "FK_67c6c6236c69cf0173a89083485"`);
        await queryRunner.query(`ALTER TABLE "hopper_configs" DROP CONSTRAINT "FK_1ad16efb11a95ce5a1c2ef3c34a"`);
        await queryRunner.query(`ALTER TABLE "hopper_configs" DROP CONSTRAINT "FK_edeb3236fba7a5b64e426ad066d"`);
        await queryRunner.query(`ALTER TABLE "recipe_ingredients" DROP CONSTRAINT "FK_ae8e29989e9108f27cf7198e606"`);
        await queryRunner.query(`ALTER TABLE "recipe_ingredients" DROP CONSTRAINT "FK_2d7f407ae694e91bb3da1798c61"`);
        await queryRunner.query(`ALTER TABLE "categories" DROP CONSTRAINT "FK_9a6f051e66982b5f0318981bcaa"`);
        await queryRunner.query(`ALTER TABLE "coffee_varieties" DROP CONSTRAINT "FK_cd481b68df525b2cbc119f84520"`);
        await queryRunner.query(`ALTER TABLE "stocks" DROP CONSTRAINT "FK_3024bbca6232c8b6efa3ff51028"`);
        await queryRunner.query(`ALTER TABLE "products" DROP CONSTRAINT "FK_ff56834e735fa78a15d0cf21926"`);
        await queryRunner.query(`ALTER TABLE "products" DROP CONSTRAINT "FK_fed065ae1a8b80a37a9230da1fa"`);
        await queryRunner.query(`DROP TABLE "stock_movements"`);
        await queryRunner.query(`DROP TABLE "stock_lots"`);
        await queryRunner.query(`DROP TABLE "purchase_orders"`);
        await queryRunner.query(`DROP TABLE "purchase_order_items"`);
        await queryRunner.query(`DROP TABLE "hopper_configs"`);
        await queryRunner.query(`DROP TABLE "suppliers"`);
        await queryRunner.query(`DROP TABLE "stocks"`);
        await queryRunner.query(`CREATE INDEX "IDX_recipes_active" ON "recipes" USING btree ("productId", "isActive") `);
        await queryRunner.query(`CREATE INDEX "IDX_recipes_product" ON "recipes" USING btree ("productId") `);
        await queryRunner.query(`CREATE INDEX "IDX_recipe_ingredients_recipe" ON "recipe_ingredients" USING btree ("recipeId") `);
        await queryRunner.query(`CREATE INDEX "IDX_products_category" ON "products" USING btree ("categoryId") `);
        await queryRunner.query(`CREATE INDEX "IDX_products_productType" ON "products" USING btree ("productTypeId") `);
        await queryRunner.query(`ALTER TABLE "recipes" ADD CONSTRAINT "FK_recipes_product" FOREIGN KEY ("productId") REFERENCES "products"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "recipe_ingredients" ADD CONSTRAINT "FK_recipe_ingredients_product" FOREIGN KEY ("productId") REFERENCES "products"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "recipe_ingredients" ADD CONSTRAINT "FK_recipe_ingredients_recipe" FOREIGN KEY ("recipeId") REFERENCES "recipes"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "categories" ADD CONSTRAINT "FK_categories_parent" FOREIGN KEY ("parentId") REFERENCES "categories"("id") ON DELETE SET NULL ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "coffee_varieties" ADD CONSTRAINT "FK_coffee_varieties_product" FOREIGN KEY ("productId") REFERENCES "products"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "products" ADD CONSTRAINT "FK_products_category" FOREIGN KEY ("categoryId") REFERENCES "categories"("id") ON DELETE SET NULL ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "products" ADD CONSTRAINT "FK_products_productType" FOREIGN KEY ("productTypeId") REFERENCES "product_types"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

}
