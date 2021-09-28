import { AppointmentDt } from "../../appointment/AppointmentDt.ts";
import { DLExam } from "../../appointment/DLExam.ts";

export interface LockPayload {
  appointmentDt:   AppointmentDt;
  dlExam:          DLExam;
  drvrDriver:      DrvrDriver;
  drscDrvSchl:     DrscDrvSchl;
  instructorDlNum: null;
  bookedTs:        string;
  startTm:         string;
  endTm:           string;
  posId:           number;
  resourceId:      number;
}


export interface DrscDrvSchl {
}

export interface DrvrDriver {
  drvrId: number;
}
