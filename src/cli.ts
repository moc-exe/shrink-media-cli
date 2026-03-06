#!/usr/bin/env node

type Option = {

    input: string, 
    output: string,
    quality: number, // [0-100] %
    overwrite:boolean

};

const ALLOWED_INPUT_EXTENSIONS= ["jpg","jpeg","png","webp"];
const USAGE_MSG:string = "Usage: shrinkup <input> [output] [--quality <0-100>] [--overwrite] [--help]";
type MessageMode = "log" | "error" | "warn";

function printUsage():void{
    promptUser("log", USAGE_MSG);
};

function promptUser(mode:MessageMode, msg:string):void{
    
    switch(mode){

        case "log":
            console.log(msg);
            break;
        case "error":
            console.error(msg);
            break;
        case "warn":
            console.warn(msg);
            break;
        default: console.log(msg);
    }
};


function parseArgv():Option{

    /**
     * The way I see it for now
     * shrinkup <input> [output] [--quality <0-100>] [--overwrite] [--help]
     */

    // extract the args 
    const args:string[] = process.argv.slice(2); // ditch argv idx=0, 1..., those are node runtime context
    if(args.length === 0) {
        printUsage();
        process.exit(1);
    }

    let parsedInput:string | undefined;
    let parsedOutput:string | undefined;
    let parsedQuality = 80;
    let parsedOverwrite = false;
    let inputExtension: string | undefined;

    for (let idx = 0; idx < args.length; idx++) {

        const currentArg = args[idx];

        if(currentArg === "--quality"){
            const nextArg = args[idx + 1];

            if (nextArg === undefined) {
                promptUser("error", "Parsing error: missing value after --quality");
                process.exit(1);
            }
            parsedQuality = Number(nextArg);
            if(!Number.isInteger(parsedQuality) || parsedQuality < 0 || parsedQuality > 100){
                promptUser("error", `Parsing error: quality must be [0-100]%, but provided=${parsedQuality}`);
                printUsage();
                process.exit(1);
            }
            continue;
        }
        else if(currentArg === "--overwrite"){
            parsedOverwrite = true;
        }
        else if(currentArg?.startsWith("--")){
            promptUser("error", `Error: Unknown option ${currentArg}`);
        }
        else if (parsedInput === undefined) {
            parsedInput = currentArg;
            inputExtension = currentArg?.split(".").at(1);

        } else if (parsedOutput === undefined) {
            parsedOutput = currentArg;
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
    const input: string = parsedInput;
    
    if(inputExtension === undefined || !ALLOWED_INPUT_EXTENSIONS.includes(inputExtension)){
            promptUser("error", `Wrong extension, supported extensions are ${JSON.stringify(ALLOWED_INPUT_EXTENSIONS)}`);
            process.exit(1);
    }

    if (parsedOutput === undefined) {
        parsedOutput = `compressed.${parsedInput}`;
    }   
    
    return {

            input: input, 
            output : parsedOutput, 
            quality : parsedQuality, 
            overwrite: parsedOverwrite
    }

};



async function main():Promise<void>{

    parseArgv();    
};

await main();
