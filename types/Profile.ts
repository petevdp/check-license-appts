
export interface RawProfile {
    smtpSenderEmail: string;
    name: string;
    lastname: string;
    licenseNumber: number;
    keyword: string;
    email: string;
    locationsToCheck: number[];
    examType: string;
    earliestExamDate: Date;
    latestExamDate: Date;

    maxSearchDuration?: string;
    stopSearchOnConfirmation?: boolean;
    webPort?: number;
    pollOnce?: boolean;
    pollInterval?: string;
}

export interface Profile extends RawProfile {
  // optional
  checkScheduleCron: string;
  maxSearchDuration: string;
  stopSearchOnConfirmation: boolean;
  webPort: number;
  pollOnce: boolean;
  pollInterval: string;
}
