import { PROFILE_DEFAULTS } from "../constants.ts";
import { ProfileArgs } from "../types/Args.ts";
import { Profile, RawProfile } from "../types/Profile.ts";
import JSON5 from "https://deno.land/x/json5";

const PROFILE_PROPERTIES_REQ: (keyof RawProfile)[] = [
  "name",
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
  "environment"
];

const PROFILE_PROPERTIES: (keyof RawProfile)[] = [
  ...PROFILE_PROPERTIES_OPT,
  ...PROFILE_PROPERTIES_REQ,
];

export async function parseProfileArgs(args: ProfileArgs): Promise<Profile> {
  let profile: Profile | null = null;
  if (args.configPath) {
    let rawProfile: RawProfile;
    if (args.configPath.endsWith('.json')) {
      rawProfile = await readJsonFile<Profile>(args.configPath);
    } else if (args.configPath.endsWith('.json5')) {
      rawProfile = await readJson5File<Profile>(args.configPath);
    }
  }

  if (args.configJson) {
    profile = normalizeProfileInput(JSON.parse(args.configJson));
  }

  const argsProfile: any = {};
  for (let [k, v] of Object.entries(args).filter(([k]) => PROFILE_PROPERTIES.includes(k as keyof RawProfile))) {
    argsProfile[k] = v;
  }
  profile = { ...profile, ...normalizeProfileInput(argsProfile) };
  if (!profile) {
    throw new Error();
  }

  assertProfileValid(profile);
  const withDefaults = applyDefaults(profile);

  return withDefaults as Profile;
}

function normalizeProfileInput(rawProfile: RawProfile) {
  const normalized: any = {};
  for (let k of PROFILE_PROPERTIES) {
    let v = rawProfile[k];
    if (typeof v == "undefined") {
      continue;
    }
    if (typeof v == "string") {
      normalized[k] = normalizeStringInput(v);
      continue;
    }
    normalized[k] = v;
  }
  return normalized as Profile
}

function normalizeStringInput(str: string) {
  return str.trim();
}

function assertProfileValid(profile: Profile) {
  const missing = PROFILE_PROPERTIES_REQ.filter((property) => typeof profile[property] === "undefined");
  if (missing.length > 0) {
    throw new Error("invalid profile: missing properties " + missing.join(","));
  }
}

function readJsonFile<T>(configPath: string): Promise<T> {
  return Deno.readTextFile(configPath).then((text) => JSON.parse(text) as T);
}

function readJson5File<T>(configPath: string): Promise<T> {
  return Deno.readTextFile(configPath).then((text) => JSON5.parse(text) as T);
}

function applyDefaults(profile: Profile) {
  for (const [k,v] of Object.entries(PROFILE_DEFAULTS)) {
    const key = k as keyof Profile;
    if (typeof profile[key] === "undefined") {
      profile = {...profile, [key]: v};
    }
  }
  return profile;
}
