import fs from "fs";
import path from "path";

const dataDir = path.join(process.cwd(), "src", "data");

function getFilePath(filename: string) {
    return path.join(dataDir, filename);
}

export function readData<T>(filename: string): T {
    const filePath = getFilePath(filename);
    const raw = fs.readFileSync(filePath, "utf-8");
    return JSON.parse(raw) as T;
}

export function writeData<T>(filename: string, data: T): void {
    const filePath = getFilePath(filename);
    fs.writeFileSync(filePath, JSON.stringify(data, null, 4), "utf-8");
}
