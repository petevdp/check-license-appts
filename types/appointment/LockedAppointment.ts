import { AppointmentDt } from "./AppointmentDt.ts";
import { DLExam } from "./DLExam.ts";

export interface LockedAppointment {
  appointmentDt: AppointmentDt;
  startTm: string;
  endTm: string;
  posId: number;
  resourceId: number;
  dlExam: DLExam;
  lemgMsgId: number;
  officeNum: number;
  posName: string;
  bookedIndicator: string;
  bookedTs: string;
  statusCode: string;
  drvrDriver: DrvrDriver;
  drscDrvSchl: DrscDrvSchl;
  checkTm: string;
  posGeo: PosGeo;
}

export interface DrscDrvSchl {
}

export interface DrvrDriver {
  drvrId: number;
  lastName: string;
  firstName: string;
  licenseNumber: string;
  phoneNum: string;
  email: string;
  optInFlags: OptInFlags;
}

export interface OptInFlags {
  email: string;
  sms: string;
}

export interface PosGeo {
  posId: number;
  lat: number;
  lng: number;
  address: string;
  address1: string;
  city: string;
  province: string;
  postcode: string;
  agency: string;
  url: string;
}
