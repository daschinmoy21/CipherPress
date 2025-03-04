export interface Article {
  cid: string;
  author: string;
  timestamp: number;
  exists: boolean;
}

export interface NewsSubmission {
  title: string;
  content: string;
  tags: string[];
}

export interface NewsArticle extends NewsSubmission {
  id: string;
  author: string;
  timestamp: number;
} 