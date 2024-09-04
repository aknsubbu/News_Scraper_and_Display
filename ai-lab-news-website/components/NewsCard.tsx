import React from "react";
import { ExternalLink } from "lucide-react";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";

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
          src={article.top_image}
          alt={article.title}
          className="w-full h-56 object-cover"
        />
      </CardHeader>
      <CardContent className="p-4">
        <h2 className="text-2xl font-semibold mb-2 line-clamp-2">
          {article.title}
        </h2>
        {(article.summary || article.text) && (
          <p className="text-sm text-gray-600 mb-4 line-clamp-3">
            {article.summary || article.text}
          </p>
        )}
        {/* {keywordsArray.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-4">
            {keywordsArray.slice(0, 3).map((keyword, index) => (
              <Badge key={index} variant="secondary" className="text-xs">
                {keyword}
              </Badge>
            ))}
          </div>
        )} */}
      </CardContent>
      {/* <CardFooter className="p-4 pt-0 flex items-center justify-between">
        {authorsArray.length > 0 && (
          <div className="flex items-center space-x-2">
            <Avatar className="w-6 h-6">
              <AvatarImage
                src={`https://ui-avatars.com/api/?name=${authorsArray[0]}&background=random`}
              />
              <AvatarFallback>{authorsArray[0].charAt(0)}</AvatarFallback>
            </Avatar>
            <span className="text-sm text-gray-600">
              {authorsArray.join(", ")}
            </span>
          </div>
        )}
        {!authorsArray.length && (
          <span className="text-sm text-gray-600">Unknown Author</span>
        )}
        <a
          href={article.url}
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-600 hover:text-blue-800 transition-colors duration-300"
        >
          <ExternalLink size={20} />
        </a>
      </CardFooter> */}
    </Card>
  );
}
