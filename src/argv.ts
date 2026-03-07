import path from "node:path";
import type { MessageMode, Option } from "./types.js";
import { ALLOWED_INPUT_EXTENSIONS, ALLOWED_OUTPUT_EXTENSIONS } from "./types.js";

const USAGE_MSG: string =
    "Usage: shrinkup <input> [output] [--quality <0-100>] [--format <jpg|jpeg|png|webp>] [--overwrite] [--help]";

function printUsage(): void {
    promptUser("log", USAGE_MSG);
}

export function promptUser(mode: MessageMode, msg: string): void {
    switch (mode) {
        case "log":
            console.log(msg);
            break;
        case "error":
            console.error(msg);
            break;
        case "warn":
            console.warn(msg);
            break;
        default:
            console.log(msg);
    }
}

export function parseArgv(): Option {
    /**
     * shrinkup <input> [output] [--quality <0-100>] [--format <jpg|jpeg|png|webp>] [--overwrite] [--help]
     */

    const args: string[] = process.argv.slice(2);

    if (args.length === 0) {
        printUsage();
        process.exit(1);
    }

    let parsedInput: string | undefined;
    let parsedOutput: string | undefined;
    let parsedQuality: number = 80;
    let parsedOverwrite: boolean = false;
    let outputFormat: string = ".jpg";

    for (let idx = 0; idx < args.length; idx++) {
        const currentArg:string = args[idx] as string;

        if (currentArg === "--quality") {
            const nextArg = args[idx + 1];

            if (nextArg === undefined) {
                promptUser("error", "Parsing error: missing value after --quality");
                process.exit(1);
            }

            parsedQuality = Number(nextArg);

            if (!Number.isInteger(parsedQuality) || parsedQuality < 0 || parsedQuality > 100) {
                promptUser(
                    "error",
                    `Parsing error: quality must be [0-100]%, but provided=${parsedQuality}`
                );
                printUsage();
                process.exit(1);
            }

            idx++;
            continue;
        } else if (currentArg === "--format") {
            const nextArg = args[idx + 1];

            if (nextArg === undefined) {
                promptUser("error", "Parsing error: missing value after --format");
                process.exit(1);
            }

            const normalizedFormat = nextArg.startsWith(".")
                ? nextArg.toLowerCase()
                : `.${nextArg.toLowerCase()}`;

            if (!ALLOWED_OUTPUT_EXTENSIONS.includes(normalizedFormat)) {
                promptUser(
                    "error",
                    `Wrong output format: provided ${nextArg}, supported formats are ${JSON.stringify(ALLOWED_OUTPUT_EXTENSIONS)}`
                );
                process.exit(1);
            }

            if (parsedOutput !== undefined && path.extname(parsedOutput).toLowerCase() !== normalizedFormat) {
                promptUser(
                    "error",
                    `Inconsistency between provided output file extension and --format argument, supported output formats are ${JSON.stringify(ALLOWED_OUTPUT_EXTENSIONS)}`
                );
                process.exit(1);
            }

            outputFormat = normalizedFormat;
            idx++;
            continue;
        } else if (currentArg === "--overwrite") {
            parsedOverwrite = true;
            continue;
        } else if (currentArg === "--help" || currentArg === "-h") {
            printUsage();
            process.exit(0);
        } else if (currentArg.startsWith("--")) {
            promptUser("error", `Error: Unknown option ${currentArg}`);
            process.exit(1);
        } else if (parsedInput === undefined) {
            parsedInput = currentArg;

            if (!isValidInputExtension(parsedInput)) {
                promptUser(
                    "error",
                    `Wrong input extension, supported extensions are ${JSON.stringify(ALLOWED_INPUT_EXTENSIONS)}`
                );
                process.exit(1);
            }
        } else if (parsedOutput === undefined) {
            parsedOutput = currentArg;

            if (!isValidOutputExtension(parsedOutput)) {
                promptUser(
                    "error",
                    `Wrong output extension, supported extensions are ${JSON.stringify(ALLOWED_OUTPUT_EXTENSIONS)}`
                );
                process.exit(1);
            }

            outputFormat = path.extname(parsedOutput as string).toLowerCase();
        } else {
            promptUser("error", `Error: unexpected argument ${currentArg}`);
            process.exit(1);
        }
    }

    if (parsedInput === undefined) {
        promptUser("error", "Parsing error: missing input");
        printUsage();
        process.exit(1);
    }

    if (parsedOutput === undefined) {
        parsedOutput = makeDefaultOutput(parsedInput, outputFormat);
    }

    return {
        input: parsedInput,
        output: parsedOutput,
        quality: parsedQuality,
        overwrite: parsedOverwrite,
        outputFormat: outputFormat,
    };
}

function makeDefaultOutput(input: string, outputExtension: string): string {
    const ext = path.extname(input);
    const base = path.basename(input, ext);
    return `${base}.compressed${outputExtension}`;
}

function isValidOutputExtension(file: string): boolean {
    return ALLOWED_OUTPUT_EXTENSIONS.includes(path.extname(file).toLowerCase());
}

function isValidInputExtension(file: string): boolean {
    return ALLOWED_INPUT_EXTENSIONS.includes(path.extname(file).toLowerCase());
}