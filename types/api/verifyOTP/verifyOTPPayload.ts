export interface VerifyOTPRequest {
  bookedTs: Date;
  drvrID: number;
  code: string;
}
