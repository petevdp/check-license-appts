import { BaseContext, State } from "../types/contexts.ts";
import { StatefulEvt } from "../utils/StatefulEvt.ts";


export class EventService {
  public state$: StatefulEvt<State>;
  public isPolling$: StatefulEvt<boolean>;

  constructor(baseContext: BaseContext) {
    console.log({ baseContext });
    this.state$ = new StatefulEvt<State>({
      type: "base",
      context: baseContext,
    });

    this.state$.post({
      type: "base",
      context: baseContext,
    });

    console.log({after: this.state$.state})

    this.isPolling$ = new StatefulEvt<boolean>(false);
  }

  destroy() {
    this.isPolling$.post(false);
    this.isPolling$.detach();
    this.state$.detach();
  }
}
