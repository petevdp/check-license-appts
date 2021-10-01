import { AvailableAppointment } from "./appointment/AvailableAppointment.ts";
import { Profile } from "./Profile.ts";
import { Driver } from "./Driver.ts";
import { LockedAppointment } from "./appointment/LockedAppointment.ts";


export interface BaseContext {
  profile: Profile;
}

export interface LoginContext extends BaseContext {
  driver: Driver;
  bearerToken: string;
}

export interface BookingContext extends LoginContext {
  availableAppointment: AvailableAppointment;
}

export interface AppointmentLockedContext extends BookingContext {
  lockedAppointment: LockedAppointment;
}


export type State = {
  type: "base"
  context: BaseContext;
} | {
  type: "loggedIn"
  context: LoginContext;
} | {
  type: "appointmentLocked"
  context: AppointmentLockedContext;
} | {
  type: "appointmentConfirmed",
  context: AppointmentLockedContext;
}

