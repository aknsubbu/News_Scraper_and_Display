// pages/api/articles.js
import fs from "fs";
import path from "path";

const ABSOLUTE_PATH_TO_JSON =
  "/Volumes/Dev Drive/PSG Codebases/News_Scraper_and_Display/data.json";

import { Article } from "@/types/article";

export async function GET() {
  try {
    const filePath = path.resolve(ABSOLUTE_PATH_TO_JSON);
    const jsonData = fs.readFileSync(filePath, "utf-8");
    const data = JSON.parse(jsonData) as Article[];

    // Sort the articles by timestamp in descending order (newest first)
    const sortedData = data.sort(
      (a: Article, b: Article) =>
        new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime(),
    );

    return new Response(JSON.stringify(sortedData), {
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
