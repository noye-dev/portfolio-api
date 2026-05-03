import 'dotenv/config';
import Parser from 'rss-parser';
import { prisma } from '../lib/prisma';

const username = process.env.ZENN_USERNAME;
const parser = new Parser({ timeout: 10000 });

if (!username) {
  console.error('ZENN USERNAME is not set');
  process.exit(1);
}

const feedUrl = `https://zenn.dev/${username}/feed`;
console.log('Fetching:', feedUrl);

async function main() {
  const feed = await parser.parseURL(feedUrl);
  for (const item of feed.items) {
    // ① 必須フィールドが揃っていない item はスキップ
    if (!item.link || !item.title || !item.pubDate) {
      console.warn('Skip (missing fields):', item.title);
      continue;
    }

    // ② 既存チェック
    const existing = await prisma.timelineItem.findFirst({
      where: { url: item.link },
    });
    if (existing) {
      console.log('Skip (already exists):', item.title);
      continue;
    }

    // ③ 新規 create
    await prisma.timelineItem.create({
      data: {
        source: 'ZENN',
        title: item.title,
        url: item.link,
        summary: item.contentSnippet,
        publishedAt: new Date(item.pubDate),
      },
    });
    console.log('Created:', item.title);
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
