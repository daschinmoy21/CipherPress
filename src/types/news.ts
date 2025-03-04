export interface NewsArticle {
  id: string;
  title: string;
  content: string;
  tags: string[];
  timestamp: number;
  author: string;
  cid?: string; // IPFS content identifier
}

export interface NewsSubmission {
  title: string;
  content: string;
  tags: string[];
} 