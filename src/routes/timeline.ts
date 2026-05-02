import { Router, Request, Response } from 'express';
import { prisma } from '../lib/prisma';
import { authMiddleware } from '../middleware/auth';

const router = Router();

router.get('/', async (_req: Request, res: Response) => {
  try {
    const items = await prisma.timelineItem.findMany({
      orderBy: { publishedAt: 'desc' },
    });
    res.json(items);
  } catch {
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

router.post('/', authMiddleware, async (req: Request, res: Response) => {
  try {
    const { title, summary, content, slug, publishedAt, category } = req.body;

    const parsedDate = new Date(publishedAt);
    if (isNaN(parsedDate.getTime())) {
      res.status(400).json({ error: 'Invalid publishedAt' });
      return;
    }

    const item = await prisma.timelineItem.create({
      data: {
        source: 'INTERNAL',
        title,
        summary,
        content,
        slug,
        publishedAt: parsedDate,
        category,
      },
    });

    res.status(201).json(item);
  } catch {
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

export default router;
