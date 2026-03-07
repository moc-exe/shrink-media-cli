export type Option = {

    input: string, 
    output: string,
    quality: number, // [0-100] %
    overwrite:boolean, 
    outputFormat: string

};

export type MessageMode = "log" | "error" | "warn";

export const ALLOWED_INPUT_EXTENSIONS:string[]= [".jpg",".jpeg",".png",".webp"];
export const ALLOWED_OUTPUT_EXTENSIONS:string[]=[".jpg", ".jpeg", ".png", ".webp"];