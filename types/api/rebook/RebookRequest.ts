export interface RebookRequest {
  userId: string;
  appointment: Appointment;
  action: string;
}

interface Appointment {
  appointmentDt: AppointmentDt;
  startTm: string;
  endTm: string;
  posId: number;
  resourceId: number;
  dlExam: DlExam;
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

interface PosGeo {
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

interface DrscDrvSchl {}

interface DrvrDriver {
  drvrId: number;
  lastName: string;
  firstName: string;
  licenseNumber: string;
  phoneNum: string;
}

interface DlExam {
  code: string;
  description: string;
}

interface AppointmentDt {
  dayOfWeek: string;
  date: string;
}
