export type Option = {

    input: string, 
    output: string,
    quality: number, // [0-100] %
    overwrite:boolean

};

export type MessageMode = "log" | "error" | "warn";
