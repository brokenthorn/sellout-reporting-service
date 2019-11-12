import { instanceOfIReportingJob, IReporter, IReportingJob } from "./reports";
import { config, ConnectionPool } from "mssql";

/**
 * Extra options for a {@link SQLServerReporter}.
 */
export interface SQLServerReporterOptions extends config {}

/**
 * A reporter that runs queries on SQL Server to produce reports.
 */
export class SQLServerReporter implements IReporter {
  public readonly name: string;

  private _jobs: IReportingJob[] = [];
  private _connectionPoolInitialized: boolean = false;

  private readonly _options: SQLServerReporterOptions;
  private readonly _connectionPool: ConnectionPool;

  /**
   * Create a new instance of {@link SQLServerReporter}.
   * @param name A descriptive name for this reporter instance.
   * @param options Extra options needed to initialize this instance.
   */
  constructor(name: string, options: SQLServerReporterOptions) {
    this.name = name;
    this._options = options;

    // set up and initialize the database connection pool:
    this._connectionPool = new ConnectionPool(
      Object.assign(this._options, {
        stream: true,
        beforeConnect: conn => {
          const connectionID = Math.floor(Math.random() * 10000);
          conn.on("error", err => {
            console.error(`Error from connection ${connectionID}:`, err);
          });
          conn.on("connect", err => {
            err
              ? console.error(
                  `Connection ${connectionID} from pool within '${this.name}' reporter failed to connect:`,
                  err,
                )
              : console.log(
                  `New connection ${connectionID} from pool within '${this.name}' reporter, created successfully.`,
                );
          });
          conn.on("end", () => {
            console.log(
              `Connection ${connectionID} from pool within '${this.name}' reporter ended/released.`,
            );
          });
        },
      } as config),
      (err: any) => {
        if (err) {
          console.error(`Error creating connection pool in '${this.name}' reporter:`, err);
          this._connectionPoolInitialized = false;
        } else {
          console.info(`Connection pool created in reporter '${this.name}'.`);
          this._connectionPoolInitialized = true;
        }
      },
    );

    // set up some event handlers for events emitted by the pool:
    this._connectionPool.on("error", err => {
      console.error(`Error from connection pool in ${this.name} reporter:`, err);
    });

    this._connectionPool.on("connect", err => {
      err
        ? console.error(
            `Error connecting to server from connection pool in ${this.name} reporter:`,
            err,
          )
        : console.log(
            `Connection pool in ${this.name} reporter successfully created new connection.`,
          );
    });
  }

  public addReportingJob(job: IReportingJob): { error?: string } {
    // check name:
    if (this._jobs.find(j => j.name == job.name)) {
      return {
        error: `Cannot add two jobs with the same name: '${job.name}'.`,
      };
    }
    this._jobs.push(job);
    return {};
  }

  public removeReportingJob(jobOrJobName: string | IReportingJob): { error?: string } {
    if (typeof jobOrJobName === "string") {
      const index = this._jobs.findIndex(value => value.name == jobOrJobName);
      if (index < 0) {
        return { error: `No job found with the name ${jobOrJobName}.` };
      }
      const theRemoved = this._jobs.splice(index, 1);
      theRemoved.forEach(value => console.log(`Removed job ${value.name} from ${this.name}.`));
      return {};
    }

    if (instanceOfIReportingJob(jobOrJobName)) {
      const index = this._jobs.findIndex(value => value.name == jobOrJobName.name);
      if (index < 0) {
        return { error: `No job found with the name ${jobOrJobName}.` };
      }
      const theRemoved = this._jobs.splice(index, 1);
      theRemoved.forEach(value => console.log(`Removed job ${value.name} from ${this.name}.`));
      return {};
    }

    return { error: "Invalid type for argument jobOrJobName." };
  }

  async start(): Promise<undefined> {
    let millisecondsPassed = 0;
    const waitForConnectionPoolToBeReadyExecutor = (
      resolve: (value?: PromiseLike<undefined> | undefined) => void,
      reject: (reason?: any) => void,
    ) => {
      setTimeout(() => {
        if (millisecondsPassed < 30000) {
          millisecondsPassed += 2000;
          if (this._connectionPoolInitialized) {
            resolve();
          } else {
            waitForConnectionPoolToBeReadyExecutor(resolve, reject);
          }
        } else
          reject(
            "Aborting start because the connection pool failed to initialize in the last ~30s.",
          );
      }, 2000);
    };

    await new Promise(waitForConnectionPoolToBeReadyExecutor);

    console.log(`Connection pool in ${this.name} reporter looks like finally finished connecting.`);

    // can be surrounded by try-catch because request() can fail:
    const request = this._connectionPool.request();

    const result = await request.query("SELECT 1;");

    console.log(JSON.stringify(result, null, 2));

    //
    // request.on("recordset", columns => {
    //   // Emitted once for each recordset in a query
    //   console.log("start > request > recordset:");
    //   console.dir(columns);
    // });
    // request.on("row", row => {
    //   // Emitted for each row in a recordset
    //   console.log("start > request > row:");
    //   console.dir(row);
    // });
    // request.on("error", err => {
    //   // May be emitted multiple times
    //   console.error("start > request > error:", err);
    // });
    // request.on("done", result => {
    //   // Always emitted as the last one
    //   console.log("start > request > done:");
    //   console.dir(result);
    // });
    //
    // const result = await request.query("select 1;");
    // console.log("start > request > await query result:");
    // console.dir(result);
    //
    console.log(`'${this.name}' reporter started.`);
    return;
  }

  async stop(): Promise<undefined> {
    console.log(`'${this.name}' reporter stopped.`);
    return;
  }

  jobCount(): number {
    return this._jobs.length;
  }
}
