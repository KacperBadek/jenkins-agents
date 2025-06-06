const request = require('supertest');
const express = require('express');
const app = require('../server');

describe('GET /api/status', () => {
    it('should return status and version', async () => {
        const res = await request(app).get('/api/status');
        expect(res.statusCode).toEqual(200);
        expect(res.body).toHaveProperty('status', 'OK');
        expect(res.body).toHaveProperty('version');
    });
});
