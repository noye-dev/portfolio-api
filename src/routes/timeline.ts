import { Router, Request, Response } from 'express';
import { prisma } from '../lib/prisma';

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

export default router;
