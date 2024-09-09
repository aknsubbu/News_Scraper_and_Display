"use client";

import { ExternalLink } from "lucide-react";

import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";

interface Article {
  title: string;
  text: string;
  authors?: string[];
  top_image: string;
  keywords?: string[];
  url: string;
}

export function NewsCard({ article }: { article: Article }) {
  return (
    <Card className="w-full max-w-md overflow-hidden transition-shadow duration-300 hover:shadow-lg">
      <CardHeader className="p-0">
        <img
          alt={article.title}
          className="w-full h-48 object-cover"
          src={article.top_image}
        />
      </CardHeader>
      <CardContent className="p-4">
        <h2 className="text-xl font-semibold mb-2 line-clamp-2">
          {article.title}
        </h2>
        <p className="text-sm text-gray-600 mb-4 line-clamp-3">
          {article.text}
        </p>
        {article.keywords && (
          <div className="flex flex-wrap gap-2 mb-4">
            {article.keywords.slice(0, 3).map((keyword, index) => (
              <Badge key={index} className="text-xs" variant="secondary">
                {keyword}
              </Badge>
            ))}
          </div>
        )}
      </CardContent>
      <CardFooter className="p-4 pt-0 flex items-center justify-between">
        <div className="flex items-center space-x-2">
          {article.authors && article.authors.length > 0 && (
            <Avatar className="w-6 h-6">
              <AvatarImage
                src={`https://ui-avatars.com/api/?name=${article.authors[0]}&background=random`}
              />
              <AvatarFallback>{article.authors[0].charAt(0)}</AvatarFallback>
            </Avatar>
          )}
          <span className="text-sm text-gray-600">
            {article.authors ? article.authors.join(", ") : "Unknown Author"}
          </span>
        </div>
        <a
          className="text-blue-600 hover:text-blue-800 transition-colors duration-300"
          href={article.url}
          rel="noopener noreferrer"
          target="_blank"
        >
          <ExternalLink size={20} />
        </a>
      </CardFooter>
    </Card>
  );
}
