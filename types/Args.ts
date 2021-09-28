import { Args } from "https://deno.land/std/flags/mod.ts";
import { RawProfile } from "./Profile.ts";

export interface ProfileArgs extends RawProfile, Args {
  configPath?: string;
  configJson?: string;
}
