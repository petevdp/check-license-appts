export interface GetAvailableAppointmentsPayload {
  aPosID: number;
  examType: string;
  examDate: Date;
  ignoreReserveTime: boolean;
  prfDaysOfWeek: number[];
  prfPartsOfDay: number[];
  lastName: string;
  licenseNumber: number;
}
