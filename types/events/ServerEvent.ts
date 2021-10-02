import { LockedAppointment } from "../appointment/LockedAppointment.ts";
import { ClientSideAppointment } from "../appointment/ClientSideAppointment.ts";

export type AppointmentState =
  | {
    state: "found" | "booked";
    appointment: ClientSideAppointment;
  }
  | {
    state: "notFound";
  };

export type ServerEvent =
  | {
    type: "pollingStopped";
  }
  | {
    type: "appointmentFound";
    appointment: ClientSideAppointment;
  }
  | {
    type: "appointmentConfirmed";
    appointment: ClientSideAppointment;
  }
  | {
    type: "init";
    isPolling: boolean;
    appointmentState: AppointmentState;
  };
