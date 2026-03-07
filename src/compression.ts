import { existsSync, statSync } from "node:fs";
import sharp from "sharp";
import { promptUser } from "./argv.js";
import type { Option } from "./types.js";

export async function compressImage(options: Option): Promise<void> {
    if (existsSync(options.output) && !options.overwrite) {
        throw new Error(
        `Output file already exists: ${options.output}. Please use --overwrite to replace.`,
        );
    }
    
    const sizeBeforeCompression = statSync(options.input).size;

    switch (options.outputFormat) {
        case ".jpg":
        case ".jpeg":
            await sharp(options.input).jpeg({ quality:options.quality }).toFile(options.output);
            break;
        case ".png":
            await sharp(options.input).png({ quality:options.quality }).toFile(options.output);
            break;
        case ".webp":
            await sharp(options.input).webp({ quality:options.quality }).toFile(options.output);
            break;
    }

    const sizeAfterCompression = statSync(options.output).size;
    const savedPct = (((sizeBeforeCompression - sizeAfterCompression) / sizeBeforeCompression) * 100).toFixed(2); // in %
    
    promptUser("log", `Compressed: ${options.input} -> ${options.output}`);
    promptUser("log", `Before: ${sizeBeforeCompression} bytes`);
    promptUser("log", `After:  ${sizeAfterCompression} bytes`);
    promptUser("log", `Saved:  ${savedPct}%`);
};