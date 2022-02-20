import { pollAppointments } from "./pollAppointments.ts";
import { EventService } from "./services/eventService.ts";
import { parseArgs } from "./repositories/argsRepository.ts";
import { open } from "open";
import { WebService } from "./services/webService.ts";

async function main() {
  const profile = await parseArgs();
  console.log({ profile });
  const eventService = new EventService({ profile });
  const webService = new WebService(eventService);
  console.log({ evtstate: eventService.state$.state });
  webService.startServer();
  webService.startWebsocketServer();
  pollAppointments(eventService);
  !profile.noOpen && open(`http://localhost:${profile.webPort}`);
}

main();
