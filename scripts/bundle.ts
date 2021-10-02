import { ROOT_HTML_PATH, HTML_TS_BUNDLE_PATH } from "../constants.ts";

const text = Deno.readTextFileSync(ROOT_HTML_PATH);
const sanitized = text.replace("`", "\`");

Deno.writeTextFileSync(HTML_TS_BUNDLE_PATH, `
// generated by build.ts, sourced by ${ROOT_HTML_PATH}. Do not edit manually.
export const htmlBundle = \`${sanitized}\`
`);
