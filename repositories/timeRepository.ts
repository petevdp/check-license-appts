export function parseTimeToMs(timeStr: string): number {
  if (timeStr.length <= 1) {
    throw new Error(`Could not parse time string ${timeStr}`);
  }
  let raw = Number(timeStr.slice(0, timeStr.length - 1));
  if (timeStr.endsWith("s")) {
    return raw * 1000;
  }
  if (timeStr.endsWith("m")) {
    return raw * 1000 * 60;
  }

  if (timeStr.endsWith("h")) {
    return raw * 1000 * 60 * 60;
  }
  throw new Error(`Could not parse time string ${timeStr}`);
}
