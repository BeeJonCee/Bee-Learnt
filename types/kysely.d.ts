// Local stub for the `kysely` package types.
//
// This repository currently has a corrupted `node_modules/kysely` install where some
// `.d.ts` files contain binary/JSON data, which breaks `next build` typechecking.
//
// We only need enough surface area for dependencies (e.g. `better-auth`) that
// reference `Kysely` in their type definitions.

declare module "kysely" {
  export class Kysely<DB = any> {
    constructor(...args: any[]);
  }

  export const sql: any;

  export type CompiledQuery = any;

  export const DEFAULT_MIGRATION_LOCK_TABLE: string;
  export const DEFAULT_MIGRATION_TABLE: string;

  export class DefaultQueryCompiler {
    constructor(...args: any[]);
  }

  export class PostgresDialect {
    constructor(...args: any[]);
  }

  export class MysqlDialect {
    constructor(...args: any[]);
  }

  export class SqliteDialect {
    constructor(...args: any[]);
  }

  export class MssqlDialect {
    constructor(...args: any[]);
  }
}

declare module "kysely/*" {
  const value: any;
  export = value;
}
