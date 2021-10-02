import { parse } from "https://deno.land/std/flags/mod.ts";
import { ProfileArgs } from "./types/Args.ts";
import { pollAppointments } from "./pollAppointments.ts";
import { EventService } from "./services/eventService.ts";
import { parseProfileArgs } from "./repositories/argsRepository.ts";
import { opn } from "https://denopkg.com/hashrock/deno-opn/opn.ts";
import { WebService } from "./services/webService.ts";

async function main() {
  const rawArgs = parse(Deno.args);
  const profile = await parseProfileArgs(rawArgs as ProfileArgs);
  console.trace({ profile });
  const eventService = new EventService({ profile });
  const webService = new WebService(eventService);
  webService.startServer();
  webService.startWebsocketServer();
  pollAppointments(eventService);
  !profile.noOpen && opn(`http://localhost:${profile.webPort}`);
}

main();
