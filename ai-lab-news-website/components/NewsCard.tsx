import React from "react";

import { Card, CardContent, CardHeader } from "@/components/ui/card";

interface NewsCardProps {
  title: string;
  text: string;
  authors?: string[] | string;
  top_image: string;
  keywords?: string[] | string;
  summary: string;
  url: string;
  timestamp: string;
  displayed: number;
}

export default function NewsCard({ article }: { article: NewsCardProps }) {
  // Function to safely get keywords as an array
  const getKeywords = (keywords?: string[] | string): string[] => {
    if (Array.isArray(keywords)) {
      return keywords.filter((k) => k.trim() !== "");
    } else if (typeof keywords === "string") {
      return keywords
        .split(",")
        .map((k) => k.trim())
        .filter((k) => k !== "");
    }

    return [];
  };

  // Function to safely get authors as an array
  const getAuthors = (authors?: string[] | string): string[] => {
    if (Array.isArray(authors)) {
      return authors.filter((a) => a.trim() !== "");
    } else if (typeof authors === "string") {
      return authors
        .split(",")
        .map((a) => a.trim())
        .filter((a) => a !== "");
    }

    return [];
  };

  const keywordsArray = getKeywords(article.keywords);
  const authorsArray = getAuthors(article.authors);

  return (
    <Card className="w-full max-w-3xl overflow-hidden transition-shadow duration-300 hover:shadow-lg m-10 border-2 border-gray-700">
      <CardHeader className="p-0">
        <img
          alt={article.title}
          className="w-full h-56 object-cover"
          src={article.top_image}
        />
      </CardHeader>
      <CardContent className="p-4">
        <h2 className="text-2xl font-semibold mb-2 line-clamp-2">
          {article.title}
        </h2>
        {(article.summary || article.text) && (
          <p className="text-sm text-gray-200 mb-4 line-clamp-3">
            {article.summary || article.text}
          </p>
        )}
      </CardContent>
    </Card>
  );
}
