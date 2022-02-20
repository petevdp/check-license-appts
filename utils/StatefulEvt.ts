import { Evt } from "evt/mod.ts";

export class StatefulEvt<T> extends Evt<T> {
  constructor(public state: T) {
    super();
    this.post(state);
  }

  public post(state: T) {
    this.state = state;
    super.post(state);
    return 1;
  }
}
