import { Evt } from "https://deno.land/x/evt@v1.10.1/mod.ts";

type ArrayElement<ArrayType extends readonly unknown[]> =
  ArrayType extends readonly (infer ElementType)[] ? ElementType : never;

export function combineLatest<T extends any[]>(evts: Evt<ArrayElement<T>>[]) {
  const combined = new Evt<T>();
  const state: any = {};
  let allEmitted = false;
  const allIndexes = evts.map((e, i) => i.toString());
  evts.forEach((e, i) => {
    e.attach((e) => {
      state[i.toString()] = e;
      if (!allEmitted) {
        allEmitted = evts.length === Object.keys(state).length;
      }
      if (allEmitted) {
        combined.post([...Object.values(state)] as T);
      }
    });
  });
  return combined;
}
