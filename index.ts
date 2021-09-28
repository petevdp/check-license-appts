import { Profile } from "./types/Profile.ts";
import { parse } from "https://deno.land/std/flags/mod.ts";
import { ProfileArgs } from "./types/Args.ts";
import { pollAppointments } from "./pollAppointments.ts";
import { BaseContext, State  } from "./types/contexts.ts";
import { EventService } from "./services/eventService.ts";
import { parseProfileArgs } from "./repositories/argsRepository.ts";

async function main() {
  const rawArgs = parse(Deno.args);
  const profile = await parseProfileArgs(rawArgs as ProfileArgs);
  const eventService = new EventService({profile});
  pollAppointments(eventService);
}

main();
