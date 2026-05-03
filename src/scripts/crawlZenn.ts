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
  // ① カウンタ初期化（const ではなく let、後で再代入するため）
  let created = 0;
  let skipped = 0;
  let failed = 0;

  try {
    const feed = await parser.parseURL(feedUrl);
    console.log(feed.title);
    console.log(feed.items.length);

    // ② ループ全体を try/catch で囲む
    for (const item of feed.items) {
      try {
        // 既存のバリデーション + findFirst + create ロジック
        if (!item.link || !item.title || !item.pubDate) {
          console.warn('Skip (missing fields):', item.title);
          skipped++;
          continue;
        }

        const existing = await prisma.timelineItem.findFirst({
          where: { url: item.link },
        });
        if (existing) {
          console.log('Skip (already exists):', item.title);
          skipped++;
          continue;
        }

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
        created++;
      } catch (err) {
        // 1件単位の失敗を吸収
        console.error('Failed to process item:', item.title, err);
        failed++;
      }
    }

    // ③ サマリ出力
    console.log(`Done: created=${created} skipped=${skipped} failed=${failed}`);
  } finally {
    // ④ 必ず接続を閉じる（成功でも失敗でも）
    await prisma.$disconnect();
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
