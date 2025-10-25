// utils/credentials.js
import fs from "fs";
import path from "path";

const CREDENTIALS_PATH = path.join(process.cwd(), "credentials.json");

export function readCredentials() {
  const data = fs.readFileSync(CREDENTIALS_PATH, "utf-8");
  return JSON.parse(data);
}

export function writeCredentials(data) {
  fs.writeFileSync(CREDENTIALS_PATH, JSON.stringify(data, null, 2), "utf-8");
}

