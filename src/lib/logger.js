export default function createDebugLogger(fileTag) {
    return (fnTag, ...args) => {
        console.log(`[${fileTag}:${fnTag}]`, ...args);
    }
}