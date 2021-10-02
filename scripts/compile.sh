#!/bin/sh
deno run --allow-read --allow-write './scripts/bundle.ts'
deno compile --output 'build/check-licence-appts-windows' --target 'x86_64-pc-windows-msvc' --allow-read --allow-net --allow-run --unstable index.ts
deno compile --output 'build/check-licence-appts-linux' --target  'x86_64-unknown-linux-gnu' --allow-read --allow-net --allow-run --unstable index.ts
