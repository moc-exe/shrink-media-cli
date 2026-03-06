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

    await sharp(options.input)
        .jpeg({
        quality: options.quality,
        progressive: true,
        mozjpeg: true,
        })
        .toFile(options.output);

    const sizeAfterCompression = statSync(options.output).size;
    const savedPct = (((sizeBeforeCompression - sizeAfterCompression) / sizeBeforeCompression) * 100).toFixed(2); // in %
    
    promptUser("log", `Compressed: ${options.input} -> ${options.output}`);
    promptUser("log", `Before: ${sizeBeforeCompression} bytes`);
    promptUser("log", `After:  ${sizeAfterCompression} bytes`);
    promptUser("log", `Saved:  ${savedPct}%`);
}