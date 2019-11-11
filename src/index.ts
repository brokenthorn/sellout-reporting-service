import { Reporter } from "./Reporter";
import { MonthlyReportingJob } from "./Report/ReportingJob";
import { ReportType } from "./Report";

// "0 22 3 * *" - cron for monthly at 22:00, 3rd day of month

const reporter = new Reporter();

const monthlyIqviaReportingJob: MonthlyReportingJob = {
  reportType: ReportType.Monthly,
  name: "Raportare lunară IQVIA",
  options: {
    sql_query: "SELECT 1;",
    sql_server_database: "BizPharmaHO",
    sql_server_host: "10.0.0.140",
    sql_server_username: "bi",
    sql_server_password: ""
  },
  when: { day: 3, hour: 22, minute: 0 },
  reportCurrentMonth: false
};

console.log(monthlyIqviaReportingJob);

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
