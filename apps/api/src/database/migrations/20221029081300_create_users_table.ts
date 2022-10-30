import { Knex } from 'knex'

export async function up(knex: Knex): Promise<void> {
  await knex.schema.raw(`
      create table users
      (
          user_id    bigint generated always as identity,
          first_name text                     not null,
          last_name  text                     not null,
          email      text                     not null,
          created_at timestamp with time zone not null default now(),
          updated_at timestamp with time zone not null default now(),

          constraint email_unique unique (email)
      );

      create trigger update_updated_at_column
          before update
          on users
          for each row
      execute procedure update_updated_at_column();
  `)
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.raw(`
    drop trigger update_updated_at_column on users;
    drop table users;
`)
}
