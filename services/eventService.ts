import { BaseContext, State } from "../types/contexts.ts";
import { Evt, StatefulEvt } from "https://deno.land/x/evt/mod.ts";
import { parseTimeToMs } from "../repositories/timeRepository.ts";

export class EventService {
  public state$: StatefulEvt<State>;
  public pollAppointment$: StatefulEvt<bigint>;
  public pollAppointmentIntervalId: number | undefined;

  constructor(baseContext: BaseContext) {
    this.state$ = new StatefulEvt<State>({
      status: "base",
      context: baseContext,
    });
    this.pollAppointment$ = new StatefulEvt(0n);
    this.pollAppointment$.attach((epoch) => console.log(`\nfiring pollAppointment$ (${epoch})`));
    this.state$.attach(() => console.log(`\nfiring state$`));
  }

  startPollApointments() {
    let epoch = 1n;
    this.pollAppointmentIntervalId = setInterval(() => {
      this.pollAppointment$.post(epoch);
      epoch++;
    }, parseTimeToMs(this.state$.state.context.profile.pollInterval));
  }
  
  stopPollAppointments() {
    if (this.pollAppointmentIntervalId) {
      clearInterval(this.pollAppointmentIntervalId);
    }
    this.pollAppointment$.detach();
  }
  
  destroy() {
    this.stopPollAppointments();
    this.state$.detach();
  }
}
