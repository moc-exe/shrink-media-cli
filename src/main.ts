#!/usr/bin/env node
import { parseArgv } from "./argv.js";
import { compressImage } from "./compression.js";

async function main():Promise<void> {
    const options = parseArgv();
    await compressImage(options);
}

await main();
