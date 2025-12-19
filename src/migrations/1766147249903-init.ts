import { MigrationInterface, QueryRunner } from "typeorm";

export class Init1766147249903 implements MigrationInterface {
    name = 'Init1766147249903'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "stats" ("id" character varying(50) NOT NULL, "key" character varying(255) NOT NULL, "json" text, "isDeleted" boolean NOT NULL DEFAULT false, "updatedAt" TIMESTAMP NOT NULL, CONSTRAINT "PK_c76e93dfef28ba9b6942f578ab1" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "stores" ("id" character varying(50) NOT NULL, "name" character varying(255) NOT NULL, "address" character varying(255), "products" integer NOT NULL DEFAULT '0', "status" character varying(50), "logo" character varying(255), "isDeleted" boolean NOT NULL DEFAULT false, "updatedAt" TIMESTAMP NOT NULL, CONSTRAINT "PK_7aa6e7d71fa7acdd7ca43d7c9cb" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "logs" ("id" character varying(50) NOT NULL, "action" text NOT NULL, "timestamp" TIMESTAMP NOT NULL, "isDeleted" boolean NOT NULL DEFAULT false, "updatedAt" TIMESTAMP NOT NULL, CONSTRAINT "PK_fb1b805f2f7795de79fa69340ba" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "orders" ("id" character varying(50) NOT NULL, "customer" character varying(255), "status" character varying(50), "total" numeric(12,2) NOT NULL DEFAULT '0', "date" TIMESTAMP, "isDeleted" boolean NOT NULL DEFAULT false, "updatedAt" TIMESTAMP NOT NULL, CONSTRAINT "PK_710e2d4957aa5878dfe94e4ac2f" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "items" ("id" character varying(50) NOT NULL, "route" character varying(255) NOT NULL, "title" character varying(255) NOT NULL, "icon" character varying(255), "isDeleted" boolean NOT NULL DEFAULT false, "updatedAt" TIMESTAMP NOT NULL, CONSTRAINT "PK_ba5885359424c15ca6b9e79bcf6" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "device_sync_state" ("deviceId" character varying(100) NOT NULL, "lastSyncAt" TIMESTAMP NOT NULL, CONSTRAINT "PK_d140c962982753133e20395e972" PRIMARY KEY ("deviceId"))`);
        await queryRunner.query(`CREATE TABLE "cashbox" ("id" character varying(50) NOT NULL, "type" character varying(10) NOT NULL, "amount" numeric(12,2) NOT NULL, "note" character varying(255), "date" TIMESTAMP, "isDeleted" boolean NOT NULL DEFAULT false, "updatedAt" TIMESTAMP NOT NULL, CONSTRAINT "PK_028b1abd9b1602a014599dd0a2f" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "c_customer" ADD "isDeleted" boolean NOT NULL DEFAULT false`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "c_customer" DROP COLUMN "isDeleted"`);
        await queryRunner.query(`DROP TABLE "cashbox"`);
        await queryRunner.query(`DROP TABLE "device_sync_state"`);
        await queryRunner.query(`DROP TABLE "items"`);
        await queryRunner.query(`DROP TABLE "orders"`);
        await queryRunner.query(`DROP TABLE "logs"`);
        await queryRunner.query(`DROP TABLE "stores"`);
        await queryRunner.query(`DROP TABLE "stats"`);
    }

}
