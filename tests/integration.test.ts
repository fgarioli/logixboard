import 'jest';
import * as express from 'express';
import supertest from 'supertest';
import {
    StatusCodes,
} from 'http-status-codes';
import application from "../src/index";
import { messages } from './messages';

describe('status integration tests', () => {
    let app: express.Application;

    beforeAll(async () => {
        app = application;
    });

    it('post messages', async () => {
        for (let i = 0; i < messages.length; i++) {
            const message = messages[i]
            let endpoint = 'shipment'
            if (message.type === 'ORGANIZATION') {
                endpoint = 'organization'
            }

            try {
                await supertest(app)
                    .post(`/${endpoint}`)
                    .send(message)
                    .expect(StatusCodes.NO_CONTENT);
            } catch (error) {
                console.error(error.code)
            }
        }
    });

    it('organizations get test', async () => {
        await supertest(app)
            .get('/organizations/34f195b5-2aa1-4914-85ab-f8849f9b541a')
            .set('Accept', 'application/json')
            .expect(StatusCodes.OK);
    });

    it('shipments get test', async () => {
        await supertest(app)
            .get('/shipments/S00001175')
            .set('Accept', 'application/json')
            .expect(StatusCodes.OK);
    });

    it('aggregatetion weight test', async () => {
        await supertest(app)
            .get('/pack/weight')
            .query({ units: 'KILOGRAMS' })
            .query({ units: 'OUNCES' })
            .query({ units: 'POUNDS' })
            .set('Accept', 'application/json')
            .expect(StatusCodes.OK);
    });

});