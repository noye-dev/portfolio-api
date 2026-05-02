import { Request, Response, NextFunction } from 'express';

export const authMiddleware = (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader?.split(' ')[1];

  if (!token || !process.env.ADMIN_API_TOKEN || token !== process.env.ADMIN_API_TOKEN) {
    res.status(401).json({ error: 'Unauthorized' });
    return;
  }

  next();
};
