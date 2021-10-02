#!/bin/sh
nodemon -e ".ts,.html,.json" -x "deno run --allow-run --allow-read --allow-write --unstable --allow-net index.ts --profile-path testFixtures/testProfile.json5 --environment development"
