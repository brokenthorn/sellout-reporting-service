import { ReportType } from "./index";

/**
 * Monthly (once a month) reporting job interface.
 */
export interface IOnceAMonthReportingJob {
  /** reports type. */
  reportType: ReportType.OnceAMonth;
  /** A descriptive name for the report, like 'Monthly Sales reports'. */
  name: string;
  /** When to execute the monthly reporting job. */
  when: { day: number; hour: number; minute: number };
  /** If true, {@link when} the reporting job executes, it reports the current
   * month, otherwise it reports the previous month.
   */
  reportCurrentMonth: boolean;
}

/**
 * Daily (once a day) reporting job interface.
 */
export interface IOnceADayReportingJob {
  /** reports type. */
  reportType: ReportType.OnceADay;
  /** A descriptive name for the report, like 'Monthly Sales reports'. */
  name: string;
  /** At which hour of the day to execute the daily reporting job. */
  hour: number;
}

/**
 * Reporting job type.
 */
export type IReportingJob = IOnceAMonthReportingJob | IOnceADayReportingJob;

/**
 * Custom type guard to check if {@link object} implements {@link IReportingJob}.
 * @param object The object to check.
 */
export function instanceOfIReportingJob(object: any): object is IReportingJob {
  // TODO: Write unit test because the object properties might get renamed later
  //  and then this method will always return false!
  return "reportType" in object && "name" in object;
}
