export interface Article {
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
