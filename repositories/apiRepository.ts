import { AllLoginInfo } from "../AllLoginInfo.ts";
import { LoginResponse } from "../types/api/login/loginResponse.ts";
import { GetAvailableAppointmentsPayload } from "../types/api/getAvailableAppointments/GetAvailableAppointmentsPayload.ts";
import { GetAvailableAppointmentsResponse } from "../types/api/getAvailableAppointments/GetAvailableAppointmentsResponse.ts";
import { Profile } from "../types/Profile.ts";
import { AppointmentLockedContext, BookingContext, LoginContext } from "../types/contexts.ts";
import { Driver } from "../types/Driver.ts";
import { LockedAppointment } from "../types/appointment/LockedAppointment.ts";
import { LockPayload } from "../types/api/lock/LockPayload.ts";

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
  
  try {
    payload = JSON.parse(payload || '');
  } catch(exception) {
  }

  console.log(`${method} ${new URL(url).pathname}`);
  const res = await fetch(input, init);
  console.log(`${method} ${new URL(url).pathname}} response status: ${res.status} ${res.statusText})`);
  if (!res.ok) {
    console.log({ payload: payload, response: await res.text() });
  }
  return res;
}

export async function login(profile: Profile): Promise<LoginContext> {
  const loginPayload = {
    drvrLastName: profile.lastname,
    // the required payload has a typo
    licenceNumber: profile.licenseNumber,
    keyword: profile.keyword,
  };
  const res = await wrappedFetch("https://onlinebusiness.icbc.com/deas-api/v1/webLogin/webLogin", {
    headers: {
      accept: "application/json, text/plain, */*",
      "cache-control": "no-cache, no-store",
      "content-type": "application/json",
      expires: "0",
      pragma: "no-cache",
      "sec-ch-ua": '"Chromium";v="94", "Google Chrome";v="94", ";Not A Brand";v="99"',
      "sec-ch-ua-mobile": "?0",
      "sec-ch-ua-platform": '"Linux"',
    },
    referrer: "https://onlinebusiness.icbc.com/webdeas-ui/login;type=driver",
    referrerPolicy: "strict-origin-when-cross-origin",
    body: JSON.stringify(loginPayload),
    method: "PUT",
    mode: "cors",
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
  const res = await wrappedFetch(
    "https://onlinebusiness.icbc.com/deas-api/v1/web/getAvailableAppointments",
    {
      headers: {
        accept: "application/json, text/plain, */*",
        authorization: bearerToken,
        "content-type": "application/json",
        "sec-ch-ua": '" Not;A Brand";v="99", "Google Chrome";v="91", "Chromium";v="91"',
        "sec-ch-ua-mobile": "?0",
      },
      referrer: "https://onlinebusiness.icbc.com/webdeas-ui/booking",
      referrerPolicy: "strict-origin-when-cross-origin",
      body: JSON.stringify(body),
      method: "POST",
      mode: "cors",
      credentials: "include",
    }
  );

  const resBody = await res.json();
  return resBody as GetAvailableAppointmentsResponse;
}

export async function lockAppointment(ctx: BookingContext): Promise<LockedAppointment> {
  const body: LockPayload = {
    appointmentDt: ctx.availableAppointment.appointmentDt,
    dlExam: ctx.availableAppointment.dlExam,
    drvrDriver: { drvrId: ctx.driver.drvrId },
    drscDrvSchl: {},
    instructorDlNum: null,
    bookedTs: new Date(),
    startTm: ctx.availableAppointment.startTm,
    endTm: ctx.availableAppointment.endTm,
    posId: ctx.availableAppointment.posId,
    resourceId: ctx.availableAppointment.resourceId,
  };
  const res = await wrappedFetch("https://onlinebusiness.icbc.com/deas-api/v1/web/lock", {
    headers: {
      accept: "application/json, text/plain, */*",
      authorization: ctx.bearerToken,
      "content-type": "application/json",
      "sec-ch-ua": '" Not;A Brand";v="99", "Google Chrome";v="91", "Chromium";v="91"',
      "sec-ch-ua-mobile": "?0",
    },
    referrer: "https://onlinebusiness.icbc.com/webdeas-ui/booking",
    referrerPolicy: "strict-origin-when-cross-origin",
    body: JSON.stringify(body),
    method: "PUT",
    mode: "cors",
  });

  return await parseJSONOrShowText(res);
}

export function sendOTP(ctx: AppointmentLockedContext) {
  throw new Error("Function not implemented.");
}

async function parseJSONOrShowText(res: Response) {
  try {
    return res.json();
  } catch (exception) {
    console.error("failed to parse json: ", await res.text());
    throw exception;
  }
}
