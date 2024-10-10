import { sql, type SQL } from "drizzle-orm";
import type { PgColumn } from "drizzle-orm/pg-core";

export function getISOFormatDateQuery(dateTimeColumn: PgColumn): SQL<string> {
  return sql<string>`to_char(${dateTimeColumn}, 'YYYY-MM-DD"T"HH24:MI:SS"Z"')`;
}
