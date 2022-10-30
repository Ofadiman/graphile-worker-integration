import { Knex } from 'knex'

export async function up(knex: Knex): Promise<void> {
  await knex.schema.raw(`
    create function update_updated_at_column() returns trigger
    language plpgsql
    as
    $$
    begin
        new.updated_at := now();
        return new;
    end;
    $$;
  `)
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.raw(`drop function update_updated_at_column;`)
}
