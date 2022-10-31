import { Router, Request, Response } from 'express';
import prisma from '../prisma';

const router = Router();

router.post('/organization', async (req: Request, res: Response) => {
    await prisma.organization.upsert({
        where: {
            id: req.body.id
        },
        update: {
            code: req.body.code,
            type: req.body.type
        },
        create: {
            type: req.body.type,
            id: req.body.id,
            code: req.body.code,
        }
    });

    res.status(204).send();
});

router.get('/organizations/:id', async (req: Request, res: Response) => {
    const ret = await prisma.organization.findUnique({
        where: {
            id: req.params.id
        }
    });

    if (ret) {
        res.send(ret);
    }

    res.status(404).send();
});

export default router;