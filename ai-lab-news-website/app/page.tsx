"use client";
import React, { useEffect, useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";

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
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [currentIndex, setCurrentIndex] = useState(0);

  const fetchArticles = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await fetch("/api/articles");

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();

      setArticles((prevArticles) => {
        const combinedArticles = [...data, ...prevArticles];
        const uniqueArticles = combinedArticles.filter(
          (article, index, self) =>
            index === self.findIndex((t) => t.url === article.url),
        );
        const sortedNewArticles = uniqueArticles.sort(
          (a, b) =>
            new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime(),
        );

        return sortedNewArticles;
      });
    } catch (error) {
      setError("Error fetching articles. Please try again later.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchArticles();
    const intervalId = setInterval(() => {
      setCurrentIndex(
        (prevIndex) => (prevIndex + 1) % Math.ceil(articles.length / 6),
      );
    }, 15000);

    return () => clearInterval(intervalId);
  }, [fetchArticles, articles.length]);

  const currentArticles = articles.slice(
    currentIndex * 6,
    (currentIndex + 1) * 6,
  );

  return (
    <div className="container mx-auto px-4">
      {loading ? (
        <div>Loading...</div>
      ) : error ? (
        <div className="text-red-500">{error}</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <AnimatePresence>
            {currentArticles.map((article, index) => (
              <motion.div
                key={article.url}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -50 }}
                initial={{ opacity: 0, y: 50 }}
                transition={{ duration: 0.5 }}
              >
                <NewsCard article={article} />
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
}
