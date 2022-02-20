#!/bin/sh
deno run \
  --watch \
  --allow-run \
  --allow-read \
  --allow-write \
  --unstable \
  --allow-net \
  --import-map ./import_map.json \
  index.ts  \
    --profile-path testFixtures/testProfile.json5
