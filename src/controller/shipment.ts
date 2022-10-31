import { organization } from '@prisma/client';
import { Router, Request, Response } from 'express';
import prisma from '../prisma';

const router = Router();

router.post('/shipment', async (req: Request, res: Response) => {
    const orgs = await prisma.organization.findMany({
        where: {
            code: {
                in: req.body.organizations
            }
        }
    });

    await prisma.shipment.upsert({
        where: {
            referenceId: req.body.referenceId
        },
        update: {
            type: req.body.type,
            organizations: {
                deleteMany: {},
                create: orgs.map((org: organization) => {
                    return {
                        organization: {
                            connect: {
                                id: org.id
                            }
                        }
                    }
                })
            },
            estimatedTimeArrival: req.body.estimatedTimeArrival,
        },
        create: {
            referenceId: req.body.referenceId,
            type: req.body.type,
            organizations: {
                create: orgs.map((org: organization) => {
                    return {
                        organization: {
                            connect: {
                                id: org.id
                            }
                        }
                    }
                })
            },
            estimatedTimeArrival: req.body.estimatedTimeArrival,
            transportPacks: {
                create: req.body.transportPacks.nodes.map((node: any) => {
                    return {
                        weight: node.totalWeight.weight,
                        unit: node.totalWeight.unit
                    }
                })
            }
        }
    });

    res.status(204).send();
});

router.get('/shipments/:referenceId', async (req: Request, res: Response) => {
    let ret = await prisma.shipment.findUnique({
        where: {
            referenceId: req.params.referenceId
        },
        include: {
            organizations: {
                select: {
                    organization: {
                        select: {
                            code: true
                        }
                    }
                }
            },
            transportPacks: true,
        }
    });

    if (!ret) {
        res.status(404).send();
        return;
    }

    type ShipmentDTO = {
        type: String | undefined,
        referenceId: String | undefined,
        organizations: any[] | undefined,
        estimatedTimeArrival: String | null | undefined,
        transportPacks: any,
    };

    let shipment: ShipmentDTO = {
        type: ret?.type,
        referenceId: ret?.referenceId,
        organizations: ret?.organizations != undefined ? ret.organizations.map((org) => {
            return org.organization.code;
        }) : undefined,
        estimatedTimeArrival: ret?.estimatedTimeArrival,
        transportPacks: {
            nodes: ret?.transportPacks != undefined ? ret.transportPacks.map((node: any) => {
                return {
                    totalWeight: {
                        weight: node.weight,
                        unit: node.unit
                    }
                }
            }) : []
        }
    }

    res.send(shipment);
});

export default router;