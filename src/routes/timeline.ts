import { Router, Request, Response } from 'express';
import { TimelineItem } from '../types/timeline';

const router = Router();

const dummyItems: TimelineItem[] = [
  {
    id: '1',
    source: 'INTERNAL',
    title: 'AWS構成をApp Runnerに変更',
    summary: 'デプロイフローを簡略化するためApp Runnerに移行しました。',
    publishedAt: new Date('2026-04-28'),
    content: '## 背景\nコスト削減のため...',
    category: 'INFRASTRUCTURE',
    slug: 'aws-app-runner-migration',
    url: null,
  },
  {
    id: '2',
    source: 'ZENN',
    title: 'TypeScriptのジェネリクス入門',
    summary: 'ジェネリクスの基本的な使い方をまとめました。',
    publishedAt: new Date('2026-04-20'),
    content: null,
    category: null,
    slug: null,
    url: 'https://zenn.dev/example/articles/typescript-generics',
  },
];

router.get('/', (_req: Request, res: Response) => {
  const sorted = [...dummyItems].sort((a, b) => b.publishedAt.getTime() - a.publishedAt.getTime());
  res.json(sorted);
});

export default router;
