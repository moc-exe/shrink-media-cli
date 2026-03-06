#!/usr/bin/env node

type Option = {

    input: string, 
    output: string,
    quality: number // [0-100] %

} | null;

const USAGE_MSG:string = "Usage: shrinkup <input> [output] [--quality <0-100>] [--overwrite] [--help]";

function parseArgv():Option{

    /**
     * The way I see it for now
     * shrinkup <input> [output] [--quality <0-100>] [--overwrite] [--help]
     */

    // extract the args 
    const args:string[] = process.argv.slice(2); // ditch argv 0, 1...

    if(args.length === 0) {
        printUsage();
        process.exit(1);
    }

    for(const arg of args){

        

    }

    console.log(process.argv);
    return null;
};

function printUsage():void{
    console.log(USAGE_MSG);
}



async function main():Promise<void>{

    parseArgv();    
};

await main();
