#!/usr/bin/env node

type Option = {

    input: string, 
    output: string,
    quality: number // [0-100] %

} | null;


function parseArgv():Option{

    console.log(process.argv);
    return null;
};




async function main():Promise<void>{

    parseArgv();    
};

await main();
