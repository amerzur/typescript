import { Format, Resolution } from "./interfaces";

export function ensure<T>(argument: T | undefined | null, message: string = 'This value was promised to be there.'): T {
    if (argument === undefined || argument === null) {
        throw new TypeError(message);
    }
    return argument;
}
function isArrayOfStrings(value: any): boolean {
    return Array.isArray(value) && value.every(item => typeof item === "string");
}
export function setVideoResolution(name: string):Format {
    const format = new Format();
    format[name] = new Resolution();
    return format
}
export function checkValidity(value: any) {
    let isValid = true;
    if (typeof value == 'string') // string
        isValid = value.trim() !== "" && isValid;
    else if (isArrayOfStrings(value)) // string[]
        isValid = value.length > 0 && isValid
    return isValid
}