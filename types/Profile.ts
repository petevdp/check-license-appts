export interface RawProfile {
  smtpSenderEmail: string;
  name: string;
  lastname: string;
  licenseNumber: number;
  keyword: string;
  email: string;
  locationsToCheck: number[];
  examType: string;
  earliestExamDate: string;
  latestExamDate: string;

  maxSearchDuration?: string;
  stopSearchOnConfirmation?: boolean;
  webPort?: number;
  pollOnce?: boolean;
  pollInterval?: string;
  environment?: "production" | "development";
}

export interface Profile extends RawProfile {
  environment: "production" | "development";
  // optional
  checkScheduleCron: string;
  maxSearchDuration: string;
  stopSearchOnConfirmation: boolean;
  webPort: number;
  pollOnce: boolean;
  pollInterval: string;
}
