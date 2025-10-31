import { MigrationInterface, QueryRunner } from 'typeorm';

export class Migration1761902207636 implements MigrationInterface {
  name = 'Migration1761902207636';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "box" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "label" character varying(32) NOT NULL, "status" "public"."box_status_enum" NOT NULL DEFAULT 'CREATED', "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "UQ_d4001b4bfedae8117fc0f1c3f19" UNIQUE ("label"), CONSTRAINT "CHK_8a5ed754f8a4578d97d0673fc1" CHECK ("label" ~ '^[A-Z0-9_-]{3,32}$'), CONSTRAINT "PK_1a95bae3d12a9f21be6502e8a8b" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "product" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying(100) NOT NULL, "barcode" character varying(32) NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "boxId" uuid, CONSTRAINT "UQ_7ac18742b02b8af41afdaa3b9a9" UNIQUE ("barcode"), CONSTRAINT "PK_bebc9158e480b949565b4dc7a82" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `ALTER TABLE "product" ADD CONSTRAINT "FK_13e9a5ff0ac0860a3745aa63c24" FOREIGN KEY ("boxId") REFERENCES "box"("id") ON DELETE SET NULL ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "product" DROP CONSTRAINT "FK_13e9a5ff0ac0860a3745aa63c24"`,
    );
    await queryRunner.query(`DROP TABLE "product"`);
    await queryRunner.query(`DROP TABLE "box"`);
  }
}
