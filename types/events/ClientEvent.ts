export type ClientEvent =
  | {
    type: "codeSubmission";
    code: string;
  }
  | {
    type: "stopSearch";
  };
