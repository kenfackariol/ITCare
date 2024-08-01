const request = require('supertest');
const app = require('@src/app');
const Breakdown = require('@src/models/Breakdown');
const Material = require('@src/models/Material');
const User = require('@src/models/User');
const { sequelize } = require('@src/config/database');
const applyAssociations = require('@src/utils/associations');

describe('Breakdown Routes', () => {
    let adminToken, userToken;
    let testBreakdown;
    let admin, user;
    let material;

    beforeAll(async () => {
        await applyAssociations();
    });

    afterAll(async () => {
        await Breakdown.destroy({ where: {} });
        await Material.destroy({ where: {} });
        await User.destroy({ where: {} });
        await sequelize.close();
    });

    beforeEach(async () => {
        await Breakdown.destroy({ where: {} });
        await Material.destroy({ where: {} });
        await User.destroy({ where: {} });

        material = await Material.create({
            name: 'Steel',
            createdAt: new Date(),
            updatedAt: new Date()
        });

        admin = await User.create({
            email: 'admin@example.com',
            password: 'password123',
            role: 'admin',
            createdAt: new Date(),
            updatedAt: new Date()
        });

        user = await User.create({
            email: 'user@example.com',
            password: 'password123',
            role: 'user',
            createdAt: new Date(),
            updatedAt: new Date()
        });

        // Login to get tokens
        const adminLoginResponse = await request(app)
            .post('/api/v1/users/login')
            .send({ email: 'admin@example.com', password: 'password123' });
        adminToken = adminLoginResponse.body.token;

        const userLoginResponse = await request(app)
            .post('/api/v1/users/login')
            .send({ email: 'user@example.com', password: 'password123' });
        userToken = userLoginResponse.body.token;

        testBreakdown = await Breakdown.create({
            name_requester: 'Test User',
            materialId: material.id,
            userId: user.id,
            createdAt: new Date(),
            updatedAt: new Date()
        });
    });

    afterAll(async () => {
        await sequelize.close();
    });

    describe('POST /api/v1/breakdowns', () => {
        it('should create a new breakdown when user is authenticated', async () => {
            const response = await request(app)
                .post('/api/v1/breakdowns')
                .set('Authorization', `Bearer ${userToken}`)
                .send({ name_requester: 'John Doe', materialId: material.id });

            expect(response.statusCode).toBe(201);
            expect(response.body).toHaveProperty('name_requester', 'John Doe');
        });

        it('should return 401 if user is not authenticated', async () => {
            const response = await request(app)
                .post('/api/v1/breakdowns')
                .send({ name_requester: 'John Doe', materialId: material.id });

            expect(response.statusCode).toBe(401);
        });
    });

    describe('GET /api/v1/breakdowns/:id', () => {
        it('should return a breakdown by ID when user is authenticated', async () => {
            const response = await request(app)
                .get(`/api/v1/breakdowns/${testBreakdown.id}`)
                .set('Authorization', `Bearer ${userToken}`);

            expect(response.statusCode).toBe(200);
            expect(response.body).toHaveProperty('id', testBreakdown.id);
        });

        it('should return 401 if user is not authenticated', async () => {
            const response = await request(app)
                .get(`/api/v1/breakdowns/${testBreakdown.id}`);

            expect(response.statusCode).toBe(401);
        });
    });

    describe('GET /api/v1/breakdowns', () => {
        it('should return all breakdowns when user is admin', async () => {
            const response = await request(app)
                .get('/api/v1/breakdowns')
                .set('Authorization', `Bearer ${adminToken}`);

            expect(response.statusCode).toBe(200);
            expect(Array.isArray(response.body)).toBeTruthy();
        });

        it('should return 403 when user is not admin', async () => {
            const response = await request(app)
                .get('/api/v1/breakdowns')
                .set('Authorization', `Bearer ${userToken}`);

            expect(response.statusCode).toBe(403);
        });
    });

    describe('PATCH /api/v1/breakdowns/:id', () => {
        it('should update a breakdown when user is admin', async () => {
            const response = await request(app)
                .patch(`/api/v1/breakdowns/${testBreakdown.id}`) // This will be a string in the URL
                .set('Authorization', `Bearer ${adminToken}`)
                .send({ name_requester: 'Updated Name' });

            expect(response.statusCode).toBe(200);
            expect(response.body).toHaveProperty('id', testBreakdown.id); // This should match the integer ID
            expect(response.body).toHaveProperty('name_requester', 'Updated Name');

            // Verify the update in the database
            const updatedBreakdown = await Breakdown.findByPk(testBreakdown.id);
            expect(updatedBreakdown.name_requester).toBe('Updated Name');
        });

        it('should return 403 when user is not admin', async () => {
            const response = await request(app)
                .patch(`/api/v1/breakdowns/${testBreakdown.id}`)
                .set('Authorization', `Bearer ${userToken}`)
                .send({ name_requester: 'Updated Name' });

            expect(response.statusCode).toBe(403);
        });

        it('should return 404 if breakdown to update is not found', async () => {
            const nonExistentId = 99999;
            const response = await request(app)
                .patch(`/api/v1/breakdowns/${nonExistentId}`)
                .set('Authorization', `Bearer ${adminToken}`)
                .send({ name_requester: 'Updated Name' });

            expect(response.statusCode).toBe(404);
            expect(response.body).toHaveProperty('message', 'Breakdown not found');
        });
    });

    describe('DELETE /api/v1/breakdowns/:id', () => {
        it('should delete a breakdown when user is admin', async () => {
            const response = await request(app)
                .delete(`/api/v1/breakdowns/${testBreakdown.id}`)
                .set('Authorization', `Bearer ${adminToken}`);

            expect(response.statusCode).toBe(204);
        });

        it('should return 403 when user is not admin', async () => {
            const response = await request(app)
                .delete(`/api/v1/breakdowns/${testBreakdown.id}`)
                .set('Authorization', `Bearer ${userToken}`);

            expect(response.statusCode).toBe(403);
        });
    });

    describe('GET /api/v1/breakdowns/date-range/:startDate/:endDate', () => {
        beforeEach(async () => {
            // Create some breakdowns within the date range
            await Breakdown.create({
                name_requester: 'Test User 1',
                materialId: material.id,
                userId: user.id,
                start_date_intervention: new Date('2023-06-01'),
                end_date_intervention: new Date('2023-06-02'),
            });
            await Breakdown.create({
                name_requester: 'Test User 2',
                materialId: material.id,
                userId: user.id,
                start_date_intervention: new Date('2023-07-01'),
                end_date_intervention: new Date('2023-07-02'),
            });
        });

        it('should return breakdowns within date range when user is authenticated', async () => {
            const response = await request(app)
                .get('/api/v1/breakdowns/date-range/2023-01-01T00:00:00.000Z/2023-12-31T23:59:59.999Z')
                .set('Authorization', `Bearer ${userToken}`);

            expect(response.statusCode).toBe(200);
            expect(Array.isArray(response.body)).toBeTruthy();
            expect(response.body.length).toBe(2); // Expecting the two breakdowns we created
        });

        it('should return empty array if no breakdowns in date range', async () => {
            const response = await request(app)
                .get('/api/v1/breakdowns/date-range/2022-01-01T00:00:00.000Z/2022-12-31T23:59:59.999Z')
                .set('Authorization', `Bearer ${userToken}`);

            expect(response.statusCode).toBe(200);
            expect(Array.isArray(response.body)).toBeTruthy();
            expect(response.body.length).toBe(0);
        });

        it('should return 400 if date format is invalid', async () => {
            const response = await request(app)
                .get('/api/v1/breakdowns/date-range/invalid-date/2023-12-31')
                .set('Authorization', `Bearer ${userToken}`);

            expect(response.statusCode).toBe(400);
            expect(response.body).toHaveProperty('message', 'Invalid start date format: invalid-date');
        });
    });

    describe('GET /api/v1/breakdowns/requester/:requesterName', () => {
        it('should return breakdowns by requester when user is authenticated', async () => {
            const response = await request(app)
                .get('/api/v1/breakdowns/requester/Test User')
                .set('Authorization', `Bearer ${userToken}`);

            expect(response.statusCode).toBe(200);
            expect(Array.isArray(response.body)).toBeTruthy();
        });

        it('should return 401 if user is not authenticated', async () => {
            const response = await request(app)
                .get('/api/v1/breakdowns/requester/Test User');

            expect(response.statusCode).toBe(401);
        });
    });

    describe('GET /api/v1/breakdowns/user/:userId', () => {
        it('should return breakdowns by user when user is authenticated', async () => {
            const response = await request(app)
                .get(`/api/v1/breakdowns/user/${user.id}`)
                .set('Authorization', `Bearer ${userToken}`);

            expect(response.statusCode).toBe(200);
            expect(Array.isArray(response.body)).toBeTruthy();
        });

        it('should return 401 if user is not authenticated', async () => {
            const response = await request(app)
                .get(`/api/v1/breakdowns/user/${user.id}`);

            expect(response.statusCode).toBe(401);
        });
    });

    // Additional tests to cover edge cases and error scenarios

    describe('POST /api/v1/breakdowns', () => {
        it('should return 400 if required fields are missing', async () => {
            const response = await request(app)
                .post('/api/v1/breakdowns')
                .set('Authorization', `Bearer ${userToken}`)
                .send({}); // Empty request body

            expect(response.statusCode).toBe(400);
        });
    });

    describe('GET /api/v1/breakdowns/:id', () => {
        it('should return 404 if breakdown is not found', async () => {
            const nonExistentId = 99999;
            const response = await request(app)
                .get(`/api/v1/breakdowns/${nonExistentId}`)
                .set('Authorization', `Bearer ${userToken}`);

            expect(response.statusCode).toBe(404);
        });
    });

    describe('PATCH /api/v1/breakdowns/:id', () => {
        it('should return 404 if breakdown to update is not found', async () => {
            const nonExistentId = 99999;
            const response = await request(app)
                .patch(`/api/v1/breakdowns/${nonExistentId}`)
                .set('Authorization', `Bearer ${adminToken}`)
                .send({ name_requester: 'Updated Name' });

            expect(response.statusCode).toBe(404);
        });
    });

    describe('DELETE /api/v1/breakdowns/:id', () => {
        it('should return 404 if breakdown to delete is not found', async () => {
            const nonExistentId = 99999;
            const response = await request(app)
                .delete(`/api/v1/breakdowns/${nonExistentId}`)
                .set('Authorization', `Bearer ${adminToken}`);

            expect(response.statusCode).toBe(404);
        });
    });

    describe('GET /api/v1/breakdowns/date-range/:startDate/:endDate', () => {
        it('should return 400 if date format is invalid', async () => {
            const response = await request(app)
                .get('/api/v1/breakdowns/date-range/invalid-date/invalid-date')
                .set('Authorization', `Bearer ${userToken}`);

            expect(response.statusCode).toBe(400);
        });
    });

    describe('GET /api/v1/breakdowns/requester/:requesterName', () => {
        it('should return empty array if no breakdowns found for requester', async () => {
            const response = await request(app)
                .get('/api/v1/breakdowns/requester/NonExistentRequester')
                .set('Authorization', `Bearer ${userToken}`);

            expect(response.statusCode).toBe(200);
            expect(Array.isArray(response.body)).toBeTruthy();
            expect(response.body.length).toBe(0);
        });
    });

    describe('GET /api/v1/breakdowns/user/:userId', () => {
        it('should return 400 if userId is invalid', async () => {
            const response = await request(app)
                .get('/api/v1/breakdowns/user/invalid-user-id')
                .set('Authorization', `Bearer ${userToken}`);

            expect(response.statusCode).toBe(400);
        });
    });
});