export interface GetAvailableAppointmentsPayload {
  aPosID: number;
  examType: string;
  examDate: string;
  ignoreReserveTime: boolean;
  prfDaysOfWeek: number[];
  prfPartsOfDay: number[];
  lastName: string;
  licenseNumber: number;
}
