"use client";
import React, { useEffect, useState } from "react";

import NewsCard from "@/components/NewsCard";

interface Article {
  title: string;
  text: string;
  authors?: string[];
  top_image: string;
  keywords?: string[];
  summary: string;
  url: string;
  timestamp: string;
  displayed: number;
}

export default function Home() {
  const [articles, setArticles] = useState<Article[]>([]);

  const fetchArticles = async () => {
    try {
      const response = await fetch("/api/articles");

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();

      setArticles((prevArticles) => {
        const combinedArticles = [...data, ...prevArticles];
        // Filter out duplicate articles based on the 'url'
        const uniqueArticles = combinedArticles.filter(
          (article, index, self) =>
            index === self.findIndex((t) => t.url === article.url)
        );

        // Sort articles by timestamp in descending order
        return uniqueArticles.sort(
          (a, b) =>
            new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
        );
      });
    } catch (error) {
      console.error("Error fetching articles:", error);
    }
  };

  useEffect(() => {
    fetchArticles();
    const intervalId = setInterval(fetchArticles, 5000); // Fetch every 15 seconds

    return () => clearInterval(intervalId);
  }, []);

  return (
    <section className="flex flex-col items-center justify-center gap-4 py-8 md:py-10">
      <div>
        <ul className="space-y-4">
          {articles.map((article, index) => (
            <li
              key={article.url}
              className="opacity-0 translate-y-4 animate-fade-in-up"
              style={{
                animationDelay: `${index * 100}ms`,
                animationFillMode: "forwards",
              }}
            >
              <NewsCard article={article} />
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
