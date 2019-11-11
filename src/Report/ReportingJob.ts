import { ReportOptions, ReportType } from "./index";

export interface MonthlyReportingJob {
  /** Report type. */
  reportType: ReportType.Monthly;
  /** A descriptive name for the report, like 'Monthly Sales Report'. */
  name: string;
  options?: ReportOptions;

  /** When to execute the monthly reporting job. */
  when: { day: number, hour: number, minute: number};

  /** If true, {@link when} the reporting job executes, it reports the current
   * month, otherwise it reports the previous month.
   */
  reportCurrentMonth: boolean;
}

export interface DailyReportingJob {
  /** Report type. */
  reportType: ReportType.Daily;
  /** A descriptive name for the report, like 'Monthly Sales Report'. */
  name: string;
  options?: ReportOptions;

  /** At which hour of the day to execute the daily reporting job. */
  hour: number;
}

export type ReportingJob = MonthlyReportingJob | DailyReportingJob;
