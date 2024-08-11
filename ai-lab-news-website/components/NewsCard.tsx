import React from "react";
import { Card, Image, CardBody } from "@nextui-org/react";
import { Divider } from "@nextui-org/divider";

interface NewsCardProps {
  title: string;
  text: string;
  authors?: string[]; // If authors is a string
  top_image: string;
  keywords: string[]; // This should always be an array
  summary: string;
  timestamp: string;
}

const NewsCard: React.FC<NewsCardProps> = ({
  title,
  text,
  authors,
  top_image,
  keywords,
  summary,
  timestamp,
}) => {
  return (
    <Card
      isBlurred
      className="border-none bg-background/60 dark:bg-default-100/50 max-w-[910px] m-10"
      shadow="sm"
    >
      <CardBody>
        <div className="grid grid-cols-6 md:grid-cols-12 gap-6 md:gap-4 items-start justify-start p-10">
          <div className="relative col-span-6 md:col-span-4">
            <Image
              alt={title}
              className="object-cover"
              height={200}
              shadow="md"
              src={top_image}
              width="100%"
            />
          </div>

          <div className="flex flex-col col-span-6 md:col-span-8">
            <div className="flex justify-start items-start">
              <div className="flex flex-col gap-0">
                <p className="text-2xl text-foreground/80 pb-10">
                  {text.slice(0, 180) + "..."}
                </p>
                <Divider />
                <h1 className="text-xl pb-5">{title}</h1>
              </div>
            </div>
          </div>
        </div>
      </CardBody>
    </Card>
  );
};

export default NewsCard;
