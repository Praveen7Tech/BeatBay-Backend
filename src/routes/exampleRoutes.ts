// src/routes/exampleRoutes.ts
import { Router, Request, Response } from 'express';

const router = Router();

router.get('/message', (req: Request, res: Response) => {
  res.send('code changed ');
});

export default router;
