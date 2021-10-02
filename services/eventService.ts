import { BaseContext, State } from "../types/contexts.ts";
import { StatefulEvt } from "https://deno.land/x/evt/mod.ts";

export class EventService {
  public state$: StatefulEvt<State>;
  public isPolling$: StatefulEvt<boolean>;

  constructor(baseContext: BaseContext) {
    this.state$ = new StatefulEvt<State>({
      type: "base",
      context: baseContext,
    });
    this.isPolling$ = new StatefulEvt<boolean>(false);
  }

  destroy() {
    this.isPolling$.post(false);
    this.isPolling$.detach();
    this.state$.detach();
  }
}
