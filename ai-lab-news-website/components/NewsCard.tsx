import React from "react";
import { Card, CardFooter, Image } from "@nextui-org/react";
import { Chip } from "@nextui-org/chip";

interface NewsCardProps {
  title: string;
  text: string;
  authors: string;
  top_image: string;
  timestamp: string;
  keywords: string[];
  summary: string;
}

export default function App(data: NewsCardProps) {
  return (
    <Card isFooterBlurred className="border-none" radius="lg">
      <Image
        alt={data.title}
        className="object-cover"
        height={300}
        src={data.top_image}
        width={500}
      />
      <CardFooter className="justify-between before:bg-white/10 border-white/20 border-1 overflow-hidden py-1 absolute before:rounded-xl rounded-large bottom-1 w-[calc(100%_-_8px)] shadow-small ml-1 z-10">
        <p className="text-tiny text-white/80">{data.title}</p>
        {/* display all the keywords using chips */}
        {data.keywords.map((name, index) => (
          <Chip key={index} variant="shadow">
            {name}
          </Chip>
        ))}
      </CardFooter>
    </Card>
  );
}
