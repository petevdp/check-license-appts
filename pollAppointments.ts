import { Profile } from "./types/Profile.ts";
import * as Api from "./repositories/apiRepository.ts";
import { GetAvailableAppointmentsPayload } from "./types/api/getAvailableAppointments/GetAvailableAppointmentsPayload.ts";
import { GetAvailableAppointmentsResponse } from "./types/api/getAvailableAppointments/GetAvailableAppointmentsResponse.ts";
import { AvailableAppointment } from "./types/appointment/AvailableAppointment.ts";
import {
  AppointmentLockedContext,
  BaseContext,
  BookingContext,
  LoginContext,
} from "./types/contexts.ts";
import { LockedAppointment } from "./types/appointment/LockedAppointment.ts";
import { EventService } from "./services/eventService.ts";
import { parseTimeToMs, later } from "./repositories/timeRepository.ts";

export async function pollAppointments(eventService: EventService) {
  const ctx = eventService.state$.state.context;
  if (ctx.profile.pollOnce) {
    await fetchAndBookAppointments(eventService);
    return;
  }

  eventService.isPolling$.post(true);
  let epoch = 1n;
  const pollTimeMs = parseTimeToMs(ctx.profile.pollInterval);
  while (eventService.isPolling$.state) {
    console.log(`\npolling appointments (${epoch})`);
    await fetchAndBookAppointments(eventService);
    // wait for interval time
    await later(pollTimeMs);
    epoch++;
  }
}

async function fetchAndBookAppointments(eventService: EventService) {
  let loginContext: LoginContext;
  {
    const state = eventService.state$.state;
    switch (state.type) {
      case "base":
        loginContext = await Api.login(state.context.profile);
        eventService.state$.post({ type: "loggedIn", context: loginContext });
        break;
      case "appointmentLocked":
        // check to see if we should stop searching, otherwise intentionally fall through to loginContext
        if (state.context.profile.stopSearchOnConfirmation) {
          eventService.isPolling$.post(false);
          return;
        }
      case "loggedIn":
        loginContext = state.context;
        break;
    }
  }
  let appointments = (await fetchCompatibleAppointments(loginContext)).sort(
    compareAppointments(loginContext.profile)
  );
  if (appointments.length == 0) {
    console.log("No suitable appointments found");
    return false;
  }
  console.log(`found ${appointments.length} suitable appointments`);
  const newAppointment = appointments[0];
  {
    const state = eventService.state$.state;
    switch (state.type) {
      case "appointmentLocked":
        const existingAppointment = state.context.availableAppointment;
        const chosen: AvailableAppointment = [existingAppointment, newAppointment].sort(
          compareAppointments(loginContext.profile)
        )[0];
        if (Object.is(chosen, existingAppointment)) {
          console.log("Keeping existing locked appointment");
          return;
        }
        console.log("Using new appointment");
        break;
    }
  }

  const bookingContext: BookingContext = { ...loginContext, availableAppointment: appointments[0] };
  const lockedAppointment = await Api.lockAppointment(bookingContext)
  const ctx: AppointmentLockedContext = { ...bookingContext, lockedAppointment };
  await Api.sendOTP(ctx)
  eventService.state$.post({ type: "appointmentLocked", context: ctx });
}

async function fetchCompatibleAppointments(ctx: LoginContext) {
  const baseAppointmentQueryPayload: GetAvailableAppointmentsPayload = {
    aPosID: -1, // placeholder
    examDate: ctx.profile.earliestExamDate,
    examType: ctx.profile.examType,
    ignoreReserveTime: false,
    prfDaysOfWeek: [...Array(7).keys()],
    prfPartsOfDay: [0, 1],
    lastName: ctx.profile.lastname.toUpperCase(), // not sure why we do this, may not be necessary
    licenseNumber: ctx.profile.licenseNumber,
  };
  let allAvailableAppointments: GetAvailableAppointmentsResponse = [];
  for await (const location of ctx.profile.locationsToCheck) {
    const res = await Api.getAvailableAppointments(
      { ...baseAppointmentQueryPayload, aPosID: location },
      ctx.bearerToken
    );
    allAvailableAppointments = [...allAvailableAppointments, ...res];
  }
  console.log(allAvailableAppointments);
  return [...allAvailableAppointments].filter((appointment) => {
    const date = Number(new Date(appointment.appointmentDt.date));
    const earliest = Number(new Date(ctx.profile.earliestExamDate));
    const latest = Number(new Date(ctx.profile.latestExamDate));
    return date > earliest && date < latest;
  });
}

const compareAppointments =
  (profile: Profile) =>
  (a1: AvailableAppointment, a2: AvailableAppointment): number => {
    if (a1.appointmentDt.date !== a2.appointmentDt.date) {
      return Number(a1.appointmentDt.date) - Number(a2.appointmentDt.date);
    }

    if (a1.posId === a2.posId) {
      return 0;
    }

    for (const location of profile.locationsToCheck) {
      if (a1.posId === location) {
        return -1;
      }
      if (a2.posId === location) {
        return 1;
      }
    }
    console.warn("unmatched locIds from appointments ", a1, a2);
    return 0;
  };

async function confirmBooking(bookingContext: BookingContext, eventService: EventService) {}

function linkVerificationUrl(ctx: BookingContext) {
  console.log(
    `Appointment found at ${new Date(
      ctx.availableAppointment.appointmentDt.date
    ).toLocaleDateString()}. You should receive a one-time passcode from icbc.\nWhen you get this passcode open up http://localhost:{}`
  );
}
