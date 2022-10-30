import { Command, Console } from 'nestjs-console'
import { Knex } from 'knex'
import * as migrations from '../database/migrations'
import * as fs from 'fs'
import { drop, dropLast, head, map, pipe, split } from 'ramda'
import { camelCase } from 'change-case'
import { InjectKnex } from '@graphile-worker-integration/knex'
import { WorkerUtils } from 'graphile-worker'
import { InjectWorkerUtils } from '@graphile-worker-integration/graphile-worker'

class MigrationSource implements Knex.MigrationSource<unknown> {
  async getMigration(migration: string): Promise<Knex.Migration> {
    return migrations[migration]
  }

  getMigrationName(migration: string): string {
    return migration
  }

  async getMigrations(loadExtensions: readonly string[]): Promise<string[]> {
    return Object.keys(migrations)
  }
}

@Console()
export class DatabaseCli {
  private readonly MIGRATIONS_DIRECTORY = `${process.cwd()}/apps/api/src/database/migrations`

  constructor(
    @InjectKnex() readonly knex: Knex,
    @InjectWorkerUtils() readonly workerUtils: WorkerUtils,
  ) {}

  @Command({
    command: 'migrate:latest',
  })
  async migrateLatest(): Promise<void> {
    console.log(`Running migrations.`)
    await this.knex.migrate.latest({
      migrationSource: new MigrationSource(),
    })

    await this.workerUtils.migrate()
    await this.workerUtils.release()

    console.log(`Destroying connection.`)
    await this.knex.destroy()
    console.log(`Connection destroyed.`)
  }

  @Command({
    command: 'migrate:rollback',
  })
  async migrateRollback(): Promise<void> {
    console.log(`Rolling back migrations.`)
    await this.knex.migrate.rollback({
      migrationSource: new MigrationSource(),
    })

    console.log(`Destroying connection.`)
    await this.knex.destroy()
    console.log(`Connection destroyed.`)
  }

  @Command({
    command: 'migrate:make <name>',
  })
  async migrateMake(name: string): Promise<void> {
    console.log(`Creating migration file.`)
    await this.knex.migrate.make(name, {
      migrationSource: new MigrationSource(),
      directory: this.MIGRATIONS_DIRECTORY,
      extension: 'ts',
      stub: `${process.cwd()}/apps/api/src/database/migrations/stub.txt`,
    })

    console.log(`Regenerating index.ts file.`)
    const files = fs.readdirSync(this.MIGRATIONS_DIRECTORY)
    const dropIndexAndStub = dropLast<string>(2)
    const migrations = dropIndexAndStub(files)

    const joinBy = (by: string): ((list: string[]) => string) => {
      return (list: string[]) => {
        return list.join(by)
      }
    }
    const joinByUnderscore = joinBy('_')
    const joinByNewLine = joinBy('\n')
    const dropExtension = pipe(split('.'), head<string>)
    const dropTimestamp = pipe(split('_'), drop(1), joinByUnderscore)
    const appendNewLine = (string: string): string => `${string}\n`
    const exports = map((fileName) => {
      const fileNameWithoutExtension = dropExtension(fileName)
      const fileNameWithoutExtensionAndTimestamp = dropTimestamp(fileNameWithoutExtension)
      const fileNameCamelCase = camelCase(fileNameWithoutExtensionAndTimestamp)

      return `export * as ${fileNameCamelCase} from './${fileNameWithoutExtension}'`
    }, migrations)

    fs.writeFileSync(
      `${this.MIGRATIONS_DIRECTORY}/index.ts`,
      `${appendNewLine(joinByNewLine(exports))}`,
    )

    console.log(`Destroying connection.`)
    await this.knex.destroy()
    console.log(`Connection destroyed.`)
  }
}
