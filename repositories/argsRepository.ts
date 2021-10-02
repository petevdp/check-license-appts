import { PROFILE_DEFAULTS, VERSION } from "../constants.ts";
import { Profile, RawProfile } from "../types/Profile.ts";
import { cac } from "https://unpkg.com/cac/mod.ts";
import JSON5 from "https://raw.githubusercontent.com/DevSnowflake/json5/main/mod.ts";

const PROFILE_PROPERTIES_REQ: (keyof RawProfile)[] = [
  "lastname",
  "licenseNumber",
  "keyword",
  "email",
  "examType",
  "locationsToCheck",
  "earliestExamDate",
  "latestExamDate",
];

const PROFILE_PROPERTIES_OPT: (keyof RawProfile)[] = [
  "maxSearchDuration",
  "stopSearchOnConfirmation",
  "webPort",
  "pollOnce",
  "pollInterval",
  "environment",
  "noBooking",
  "noOpen",
];

const PROFILE_PROPERTIES: (keyof RawProfile)[] = [
  ...PROFILE_PROPERTIES_OPT,
  ...PROFILE_PROPERTIES_REQ,
];

export function parseArgs(): Profile {
  const cli = cac("check-licence-appts");
  cli.version(VERSION);
  cli.help();
  cli.usage("check-licence-appts [options]");
  cli.option("--profile-path [profile-path]", "path to configured profile", {
    default: "profile.json5",
  });
  const parsed = cli.parse();
  console.debug({ parsed });
  if (parsed.options.help || parsed.options.version) {
    Deno.exit();
  }

  const rawProfile: RawProfile = readConfigFile<RawProfile>(
    parsed.options.profilePath,
  );
  let profile = normalizeProfileInput(rawProfile);
  profile = applyDefaults(profile);
  assertProfileValid(profile);
  return profile;
}

function normalizeProfileInput(rawProfile: RawProfile) {
  const normalized: any = {};
  for (const k of PROFILE_PROPERTIES) {
    const v = rawProfile[k];
    if (typeof v == "undefined") {
      continue;
    }
    if (typeof v == "string") {
      normalized[k] = normalizeStringInput(v);
      continue;
    }
    normalized[k] = v;
  }
  return normalized as Profile;
}

function normalizeStringInput(str: string) {
  return str.trim();
}

function assertProfileValid(profile: Profile) {
  const missing = PROFILE_PROPERTIES_REQ.filter(
    (property) => typeof profile[property] === "undefined",
  );
  if (missing.length > 0) {
    throw new Error("invalid profile: missing properties " + missing.join(","));
  }
}

function readConfigFile<T>(configPath: string): T {
  const text = Deno.readTextFileSync(configPath);
  if (configPath.endsWith(".json5")) {
    return JSON5.parse(text);
  }
  if (configPath.endsWith(".json")) {
    return JSON.parse(text);
  }
  throw new Error("unknown config file type" + configPath);
}

function applyDefaults(profile: Profile) {
  for (const [k, v] of Object.entries(PROFILE_DEFAULTS)) {
    const key = k as keyof Profile;
    if (typeof profile[key] === "undefined") {
      profile = { ...profile, [key]: v };
    }
  }
  return profile;
}
