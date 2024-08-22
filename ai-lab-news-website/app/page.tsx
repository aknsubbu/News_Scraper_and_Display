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
        const newArticles = data.filter(
          (newArticle: Article) =>
            !prevArticles.some(
              (prevArticle) => prevArticle.url === newArticle.url
            )
        );

        return [...newArticles, ...prevArticles];
      });
    } catch (error) {
      console.error("Error fetching articles:", error);
    }
  };

  useEffect(() => {
    fetchArticles();
    const intervalId = setInterval(fetchArticles, 60000);

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
              <NewsCard
                authors={article.authors || []}
                keywords={article.keywords || []}
                summary={article.summary}
                text={article.text}
                timestamp={article.timestamp}
                title={article.title}
                top_image={article.top_image}
              />
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
