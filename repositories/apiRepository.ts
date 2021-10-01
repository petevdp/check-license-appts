import { AllLoginInfo } from "../AllLoginInfo.ts";
import { dateToString, utcDate } from "https://deno.land/x/date_format_deno/mod.ts";
import { LoginResponse } from "../types/api/login/loginResponse.ts";
import { GetAvailableAppointmentsPayload } from "../types/api/getAvailableAppointments/GetAvailableAppointmentsPayload.ts";
import { GetAvailableAppointmentsResponse } from "../types/api/getAvailableAppointments/GetAvailableAppointmentsResponse.ts";
import { Profile } from "../types/Profile.ts";
import { AppointmentLockedContext, BookingContext, LoginContext } from "../types/contexts.ts";
import { Driver } from "../types/Driver.ts";
import { LockedAppointment } from "../types/appointment/LockedAppointment.ts";
import { LockPayload } from "../types/api/lock/LockPayload.ts";

export async function login(profile: Profile): Promise<LoginContext> {
  const loginPayload = {
    drvrLastName: profile.lastname,
    // the required payload has a typo
    licenceNumber: profile.licenseNumber,
    keyword: profile.keyword,
  };
  const res = await wrappedFetch(getUrl("/webLogin/webLogin"), {
    ...getStandardFetchInit(),
    headers: {
      ...getStandardHeaders(),
      // not sure why these were included. they came ffrom chrome
      "cache-control": "no-cache, no-store",
      expires: "0",
      pragma: "no-cache",
    },
    body: JSON.stringify(loginPayload),
    method: "PUT",
    credentials: "omit",
  });

  return {
    profile,
    driver: (await res.json()) as Driver,
    bearerToken: res.headers.get("Authorization") as string,
  };
}

export async function getAvailableAppointments(
  payload: GetAvailableAppointmentsPayload,
  bearerToken: string
): Promise<GetAvailableAppointmentsResponse> {
  const body: any = {
    ...payload,
    ...{
      prfDaysOfWeek: `[${payload.prfDaysOfWeek.join(",")}]`,
      prfPartsOfDay: `[${payload.prfPartsOfDay.join(",")}]`,
    },
  };
  const res = await wrappedFetch(getUrl("/web/getAvailableAppointments"), {
    ...getStandardFetchInit(),
    headers: {
      ...getStandardHeaders(),
      authorization: bearerToken,
    },
    body: JSON.stringify(body),
    method: "POST",
    credentials: "include",
  });

  const resBody = await res.json();
  return resBody as GetAvailableAppointmentsResponse;
}

export async function sendMsgs(ctx: BookingContext) {
  await wrappedFetch(getUrl("/web/msgs"), {
    ...getStandardFetchInit(),
    headers: {
      ...getStandardHeaders(),
      authorization: ctx.bearerToken,
    },
    body: JSON.stringify({
      aPosID: ctx.availableAppointment.posId,
      lemgMsgID: ctx.availableAppointment.lemgMsgId,
      appointmentDt: ctx.availableAppointment.appointmentDt.date,
    }),
    method: "POST",
    credentials: "include",
  });
}

export async function lockAppointment(ctx: BookingContext): Promise<LockedAppointment> {
  const body: LockPayload = {
    appointmentDt: ctx.availableAppointment.appointmentDt,
    dlExam: ctx.availableAppointment.dlExam,
    drvrDriver: { drvrId: ctx.driver.drvrId },
    drscDrvSchl: {},
    instructorDlNum: null,
    bookedTs: formatTimestamp(new Date()),
    startTm: ctx.availableAppointment.startTm,
    endTm: ctx.availableAppointment.endTm,
    posId: ctx.availableAppointment.posId,
    resourceId: ctx.availableAppointment.resourceId,
  };

  const res = await wrappedFetch(getUrl("/web/lock"), {
    ...getStandardFetchInit(),
    headers: {
      ...getStandardHeaders(),
      authorization: ctx.bearerToken,
    },
    body: JSON.stringify(body),
    method: "PUT",
    credentials: "include",
  });

  return await parseJSONOrShowText(res);
}

export async function sendOTP(ctx: AppointmentLockedContext) {
  const res = await wrappedFetch(getUrl("/web/sendOTP"), {
    ...getStandardFetchInit(),
    headers: {
      ...getStandardHeaders(),
      authorization: ctx.bearerToken,
    },
    body: JSON.stringify({
      bookedTs: ctx.lockedAppointment.bookedTs,
      drvrID: ctx.driver.drvrId,
      method: "E",
    }),
    method: "POST",
    credentials: "include",
  });
}

export async function confirmAppointment(code: string, context: AppointmentLockedContext) {
  const res = await wrappedFetch(getUrl("/web/sendOTP"), {
    ...getStandardFetchInit(),
    headers: {
      ...getStandardHeaders(),
      authorization: context.bearerToken,
    },
    body: JSON.stringify({
      bookedTs: context.lockedAppointment.bookedTs,
      drvrID: context.lockedAppointment.drvrDriver.drvrId,
      code,
    }),
    method: "POST",
    credentials: "include",
  });
}

function getUrl(path: string) {
  return new URL("https://onlinebusiness.icbc.com/deas-api/v1").toString() + path;
}

async function wrappedFetch(input: Request | URL | string, init?: RequestInit): Promise<Response> {
  let url: string;
  let method: string | undefined;
  let payload: string | undefined;
  if (input instanceof Request) {
    url = input.url;
    method = input.method;
    payload = input?.body?.toString();
  } else {
    url = input.toString();
    method = init?.method;
    payload = init?.body?.toString();
  }

  payload = JSON.parse(payload || "");

  // console.log(`${method} ${new URL(url).pathname}`);
  const res = await fetch(input, init);
  console.log(
    `${method} ${new URL(url).pathname}} response status: ${res.status} ${res.statusText})`
  );
  if (!res.ok) {
    console.log({ payload: payload, response: await res.text() });
  }
  return res;
}

function getStandardHeaders(): { [key: string]: string } {
  return {
    accept: "application/json, text/plain, */*",
    "content-type": "application/json",
    "accept-language": "en-US,en;q=0.9",
  };
}

function getStandardFetchInit(): RequestInit {
  return {
    mode: "cors",
    referrerPolicy: "strict-origin-when-cross-origin",
    referrer: "https://onlinebusiness.icbc.com/webdeas-ui/booking",
  };
}

function formatTimestamp(ts: Date) {
  return dateToString("yyyy-MM-ddThh:mm:ss", new Date());
}

async function parseJSONOrShowText(res: Response) {
  try {
    return res.json();
  } catch (exception) {
    console.error("failed to parse json: ", await res.text());
    throw exception;
  }
}
