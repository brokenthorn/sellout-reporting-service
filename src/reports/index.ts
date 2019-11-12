import { IReportingJob, instanceOfIReportingJob } from "./IReportingJob";
import { IReporter } from "./IReporter";

export { IReportingJob, IReporter, instanceOfIReportingJob };

/** Report type. */
export enum ReportType {
  OnceAMonth = "ONCE_A_MONTH",
  OnceADay = "ONCE_A_DAY",
}
