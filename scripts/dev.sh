#!/bin/sh
nodemon -e ".ts,.html,.json" -x "deno run --allow-run --allow-read --allow-write --unstable --allow-net index.ts --configPath testFixtures/testProfile.json --environment development"
