import { AppointmentDt } from "./AppointmentDt.ts";
import { DLExam } from "./DLExam.ts";

export interface AvailableAppointment {
  appointmentDt: AppointmentDt;
  startTm: string;
  endTm: string;
  posId: number;
  resourceId: number;
  dlExam: DLExam;
  lemgMsgId: number;
}
