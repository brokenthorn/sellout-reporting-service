import { ReportingJob } from "./Report/ReportingJob";

export class Reporter {
  private _jobs: ReportingJob[] = [];

  /**
   * Adds the specified reporting job to this reporter.
   * @param job The {@link ReportingJob} to add.
   */
  public addReportingJob(job: ReportingJob): { error?: string } {
    // check name:
    if (this._jobs.find(j => j.name == job.name)) {
      return {
        error: `Cannot add two jobs with the same name: '${job.name}'.`
      };
    }

    this._jobs.push(job);
    return {};
  }
}
