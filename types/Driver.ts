export interface Driver {
  drvrId:               number;
  lastName:             string;
  firstName:            string;
  licenseNumber:        string;
  phoneNum:             string;
  email:                string;
  optInFlags:           OptInFlags;
  expandedStatus:       ExpandedStatus[];
  cancellationFeeTotal: number;
  eligibleExams:        EligibleExam[];
  blockedEligibleExams: any[];
  webAappointments:     WebAappointment[];
  maxofMaxBookingDays:  number;
  webMaxSlots:          number;
  glpTrainingFlag:      string;
}

export interface EligibleExam {
  code:        string;
  description: string;
  eed:         Eed;
}

export interface Eed {
  dayOfWeek: string;
  date:      Date;
}

export interface ExpandedStatus {
  section:     string;
  master:      string;
  status:      string;
  masterDesc:  string;
  description: string;
}

export interface OptInFlags {
  email: string;
  sms:   string;
}

export interface WebAappointment {
  appointmentDt:   Eed;
  startTm:         string;
  endTm:           string;
  posId:           number;
  resourceId:      number;
  dlExam:          DLExam;
  lemgMsgId:       number;
  officeNum:       number;
  posName:         string;
  bookedIndicator: string;
  bookedTs:        Date;
  statusCode:      string;
  drvrDriver:      DrvrDriver;
  drscDrvSchl:     DrscDrvSchl;
  checkTm:         string;
  posGeo:          PosGeo;
}

export interface DLExam {
  code:        string;
  description: string;
}

export interface DrscDrvSchl {
}

export interface DrvrDriver {
  drvrId:        number;
  lastName:      string;
  firstName:     string;
  licenseNumber: string;
  phoneNum:      string;
  email:         string;
  optInFlags:    OptInFlags;
}

export interface PosGeo {
  posId:    number;
  lat:      number;
  lng:      number;
  address:  string;
  address1: string;
  city:     string;
  province: string;
  postcode: string;
  agency:   string;
  url:      string;
}
