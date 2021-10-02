export function parseTimeToMs(timeStr: string): number {
  if (timeStr.length <= 1) {
    throw new Error(`Could not parse time string ${timeStr}`);
  }
  const raw = Number(timeStr.slice(0, timeStr.length - 1));
  if (timeStr.endsWith("ms")) {
    return raw;
  }
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

export function later(delayMs: number) {
  return new Promise(function (resolve) {
    setTimeout(resolve, delayMs);
  });
}
