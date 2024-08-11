// pages/api/articles.js

import fs from "fs";
import path from "path";

const ABSOLUTE_PATH_TO_JSON =
  "/Volumes/Dev Drive/PSG Codebases/News_Scraper_and_Display/data.json";

export async function GET() {
  try {
    const filePath = path.resolve(ABSOLUTE_PATH_TO_JSON);
    const jsonData = fs.readFileSync(filePath, "utf-8");
    const data = JSON.parse(jsonData);

    return new Response(JSON.stringify(data), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error reading data.json:", error);

    return new Response(JSON.stringify({ error: "Failed to read data" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
