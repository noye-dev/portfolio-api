export type Source = 'INTERNAL' | 'ZENN';

export type TimelineItem = {
  id: string;
  source: Source;
  title: string;
  summary: string | null;
  publishedAt: Date;
  content: string | null;
  category: string | null;
  slug: string | null;
  url: string | null;
};
