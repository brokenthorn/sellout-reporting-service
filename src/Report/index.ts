
export enum ReportType {
  Monthly = "MONTHLY",
  Daily = "DAILY",
}

/**
 * Extra options for a report that might be needed for some instances of {@link ReportType}.
 *
 * If
 */
export type ReportOptions = {
  /** SQL query to run. */
  sql_query?: string;
  /** SQL stored procedure to run. */
  sql_stored_procedure?: string;
  /** Arguments to pass to the stored procedure. */
  sql_stored_procedure_arguments?: { [argumentName: string]: string };
  /** SQL Server hostname or IP address. */
  sql_server_host: string;
  /** SQL Server TCP port number if not using the default (1433). */
  sql_server_port?: number;
  sql_server_username: string;
  /** Password. */
  sql_server_password: string;
  /** Specify the database to use, otherwise the user's default database will we be used. */
  sql_server_database?: string;
};
