#!/bin/sh
deno run --watch --allow-run --allow-read --allow-write --unstable --allow-net index.ts --profile-path testFixtures/testProfile.json5 --environment development
