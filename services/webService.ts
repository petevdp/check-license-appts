import { Application } from "https://deno.land/x/abc@v1.3.3/mod.ts";
import { combineLatest } from "../repositories/evtRepository.ts";
import { LockedAppointment } from "../types/appointment/LockedAppointment.ts";
import * as Eta from "https://deno.land/x/eta@v1.6.0/mod.ts";
import * as Api from "../repositories/apiRepository.ts";
import { State } from "../types/contexts.ts";
import { EventService } from "./eventService.ts";
import { logger } from "https://deno.land/x/abc@v1.3.3/middleware/logger.ts";
import { WebSocketClient, WebSocketServer } from "https://deno.land/x/websocket@v0.1.3/mod.ts";
import { Ctx, Evt } from "https://deno.land/x/evt@v1.10.1/mod.ts";
import { AppointmentState, ServerEvent } from "../types/events/ServerEvent.ts";
import { ClientEvent } from "../types/events/ClientEvent.ts";
import { ClientSideAppointment } from "../types/appointment/ClientSideAppointment.ts";

export class WebService {
  app: Application;
  constructor(private eventService: EventService) {
    this.app = new Application();
  }

  startServer() {
    this.app
      .use(logger())
      .file("/", "./public/index.html")
      .start({ port: this.eventService.state$.state.context.profile.webPort });

    const wss = new WebSocketServer(8080);

    const clientEvent$ = new Evt<ClientEvent | false>();
    wss.on("connection", (ws: WebSocketClient) => {
      const wsCtx = new Ctx();

      const serverEvent$: Evt<ServerEvent> = Evt.merge(wsCtx, [
        this.eventService.state$
          .toStateless(wsCtx)
          .pipe([
            (state, prev) => getServerEventFromStateChange(state, prev),
            this.eventService.state$.state,
          ]),
        this.eventService.isPolling$
          .toStateless(wsCtx)
          .pipe((isPolling): [ServerEvent] | null =>
            isPolling ? null : [{ type: "pollingStopped" }]
          ),
      ]);
      serverEvent$.attach(wsCtx, (event) => {
        event && console.log(event.type, ":", event);
        event && ws.send(JSON.stringify(event));
      });

      clientEvent$.attach(wsCtx, async (event) => {
        if (!event) {
          return;
        }

        console.log(event.type, ":", event);
        switch (event.type) {
          case "stopSearch":
            this.eventService.isPolling$.post(false);
            break;
          case "codeSubmission":
            const state = this.eventService.state$.state;
            if (state.type === "appointmentLocked") {
              await Api.confirmAppointment(event.code, state.context);
            } else {
              console.warn(`tried to submit code during invalid state '${state.type}'`);
            }
            break;
        }
      });

      ws.on("message", (message: string) => {
        clientEvent$.post(JSON.parse(message));
      });

      ws.on("close", () => {
        wsCtx.done(false);
      });

      const initEvent: ServerEvent = {
        type: "init",
        isPolling: this.eventService.isPolling$.state,
        appointmentState: selectAppointmentState(this.eventService.state$.state),
      };
      serverEvent$.post(initEvent);
    });
  }
}

function getServerEventFromStateChange(curr: State, prev: State): [ServerEvent] | null {
  if (curr.type === prev.type) {
    return null;
  }
  if (curr.type === "appointmentLocked") {
    return [
      {
        type: "appointmentFound",
        appointment: getClientSideAppointment(curr.context.lockedAppointment),
      },
    ];
  }
  return null;
}

function getClientSideAppointment(appointment: LockedAppointment): ClientSideAppointment {
  return {
    type: appointment.dlExam.code,
    date: appointment.appointmentDt.date,
    startTm: appointment.startTm,
    endTm: appointment.endTm,
    location: appointment.posName,
  };
}

function selectAppointmentState(state: State): AppointmentState {
  switch (state.type) {
    case "base":
    case "loggedIn":
      return { state: "notFound" };
    case "appointmentLocked":
      return {
        state: "found",
        appointment: getClientSideAppointment(state.context.lockedAppointment),
      };
  }
}
