import {SQLServerReporter, SQLServerReporterOptions} from "./SQLServerReporter";
import { IOnceAMonthReportingJob } from "./reports/IReportingJob";
import { ReportType } from "./reports";

// "0 22 3 * *" - cron for monthly at 22:00, 3rd day of month

const options: SQLServerReporterOptions = {
  database: "BizPharmaHO",
  server: "10.0.0.140",
  connectionTimeout: 5000,
  user: "bi",
  password: "Laurentiu53tr10",
  options: {
    abortTransactionOnError: true,
    appName: "sellout-reporting-service",
    encrypt: false,
    trustedConnection: true,
  }
};

const reporter = new SQLServerReporter("SQL Server Reporter", options);

const monthlyIqviaReportingJob: IOnceAMonthReportingJob = {
  reportType: ReportType.OnceAMonth,
  name: "Raportare lunară IQVIA",
  when: { day: 3, hour: 22, minute: 0 },
  reportCurrentMonth: false,
};

// console.log(monthlyIqviaReportingJob);

let errorMessage = reporter.addReportingJob(monthlyIqviaReportingJob).error;

if (errorMessage) {
  console.error(errorMessage);
} else {
  console.warn(`Job '${monthlyIqviaReportingJob.name}' added.`);
}

errorMessage = reporter.addReportingJob(monthlyIqviaReportingJob).error;

if (errorMessage) {
  console.error(errorMessage);
} else {
  console.warn(`Job '${monthlyIqviaReportingJob.name}' added.`);
}

console.log(`reporter '${reporter.name}' has ${reporter.jobCount()} jobs.`);

reporter
  .start()
  .then(value => console.log("main, reporter start() call returned:", value))
  .catch(reason => {
    console.error("main, reporter start() call returned error:", reason);
  });
