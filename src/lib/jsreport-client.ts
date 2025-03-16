import jsreport from 'jsreport-client';
import JsReport from "jsreport-core";

// Define the function to create the JSReport client with types
const createJsReportClient = (): JsReport.Client => {
  // Read environment variables and ensure they are defined
  const jsReportUrl = process.env.JSREPORT_URL as string;
  const jsReportUser = process.env.JSREPORT_USER as string;
  const jsReportPassword = process.env.JSREPORT_PASSWORD as string;

  // Return the jsreport client with authentication
  return jsreport(
    jsReportUrl, 
    jsReportUser, 
    jsReportPassword
  );
};

export default createJsReportClient;
