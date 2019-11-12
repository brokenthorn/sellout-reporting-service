import { IReportingJob } from "./IReportingJob";

/**
 * Reporter interface.
 *
 * A reporter manages, schedules and runs reporting jobs.
 */
export interface IReporter {
  name: string;
  start(): Promise<undefined>;
  stop(): Promise<undefined>;
  jobCount(): number;
  addReportingJob(job: IReportingJob): { error?: string };
  removeReportingJob(jobOrJobName: string | IReportingJob): { error?: string };
}
