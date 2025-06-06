const request = require('supertest');
const express = require('express');
const app = require('../server');

describe('GET /api/data', () => {
    it('should return sample data', async () => {
        const res = await request(app).get('/api/data');
        expect(res.statusCode).toEqual(200);
        expect(res.body).toHaveProperty('data');
        expect(Array.isArray(res.body.data)).toBe(true);
    });
});
