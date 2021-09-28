import { Application } from "https://deno.land/x/abc@v1.3.3/mod.ts";
import {
  LockedAppointment,
} from "../types/appointment/LockedAppointment.ts";
import * as Eta from "https://deno.land/x/eta@v1.6.0/mod.ts";
import { AppointmentLockedContext, BaseContext } from "../types/contexts.ts";
import { EventService } from "./eventService.ts";
import { Profile } from "../types/Profile.ts";

class WebService {
  app: Application;
  constructor(private eventService: EventService, private profile: Profile) {
    this.app = new Application();
  }

  startServer(baseContext: BaseContext) {
    this.app
      .get("/", (c) => {
        const state = this.eventService.state$.state;
        if (state.status == "appointmentLockedAndEmailSent") {
          c.html(WebService.buildVerifyPageTemplate(state.context));
        } else {
          c.html("idk");
        }
      })
      .start({ port: this.profile.webPort });
  }

  private static buildVerifyPageTemplate(ctx: AppointmentLockedContext) {
    return `
      <!DOCTYPE html>
      <html lang="en">
        <head>
          <meta charset="UTF-8">
          <meta http-equiv="X-UA-Compatible" content="IE=edge">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Confirm Appointment</title>
          </head>
        <body>
          <form method="POST">
            <label>Confirmation Code</label>
            <input type="text" name="code" value="">
            <input readonly type="text" name="bookedTs" value="${ctx.lockedAppointment.bookedTs}">
            <input readonly type="text" name="drvrID" value="${ctx.lockedAppointment.drvrDriver.drvrId}">
            <button type="submit">Submit</button>
          </form>
        </body>
      </html>
    `;
  }
}
