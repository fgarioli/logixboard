import { Router, Request, Response } from 'express';
import prisma from '../prisma';
import convert, { Unit } from 'convert-units';

const router = Router();

const toUnit = (unit: string): Unit => {
    switch (unit) {
        case 'KILOGRAMS': // kg
            return 'kg';
        case 'OUNCES': // oz
            return 'oz';
        case 'POUNDS': // lb
            return 'lb';
        default:
            throw new Error(`Invalid unit: ${unit}`);
    }
}

router.get('/pack/weight', async (req: Request, res: Response) => {
    if (!req.query.units) {
        return res.status(400).send({ error: 'Missing units. Possible values are: KILOGRAMS, OUNCES, POUNDS' });
    }

    const ret = await prisma.transport_pack.findMany();

    const units = Array.isArray(req.query.units)
        ? req.query.units as string[]
        : [req.query.units as string];

    let result: any = {};
    try {
        units.forEach((unit) => {
            let sum = 0;
            ret.forEach((pack) => {
                sum += pack.unit != unit
                    ? convert(Number(pack.weight)).from(toUnit(pack.unit)).to(toUnit(unit))
                    : Number(pack.weight);
            });
            result[unit] = sum;
        });
    } catch (e) {
        return res.status(400).send({ error: e.message });
    }

    res.send(result);
});

export default router;