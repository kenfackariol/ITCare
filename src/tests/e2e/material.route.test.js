const request = require('supertest');
const app = require('@src/app'); // Adjust this path to your app file
const Material = require('@src/models/Material');
const User = require('@src/models/User');
const { sequelize } = require('@src/config/database');

describe('Material Routes', () => {
    let adminToken, userToken;
    let testMaterial;
    let admin, user;

    afterAll(async () => {
        await Material.destroy({ where: {} });
        await User.destroy({ where: {} });
        await sequelize.close();
    });

    beforeEach(async () => {
        await Material.destroy({ where: {} });
        await User.destroy({ where: {} });

        admin = await User.create({
            email: 'admin@example.com',
            password: 'password123',
            role: 'admin'
        });

        user = await User.create({
            email: 'user@example.com',
            password: 'password123',
            role: 'user'
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

        testMaterial = await Material.create({
            name: 'Test Material',
            // Add other required fields here
        });
    });

    afterAll(async () => {
        await sequelize.close();
    });

    describe('GET /api/v1/materials', () => {
        it('should return all materials when user is authenticated', async () => {
            const response = await request(app)
                .get('/api/v1/materials')
                .set('Authorization', `Bearer ${userToken}`);

            expect(response.statusCode).toBe(200);
            expect(Array.isArray(response.body)).toBeTruthy();
            expect(response.body.length).toBe(1);
            expect(response.body[0].name).toBe('Test Material');
        });

        it('should return 401 if user is not authenticated', async () => {
            const response = await request(app)
                .get('/api/v1/materials');

            expect(response.statusCode).toBe(401);
        });
    });

    describe('GET /api/v1/materials/:id', () => {
        it('should return a material by ID when user is authenticated', async () => {
            const response = await request(app)
                .get(`/api/v1/materials/${testMaterial.id}`)
                .set('Authorization', `Bearer ${userToken}`);

            expect(response.statusCode).toBe(200);
            expect(response.body).toHaveProperty('id', testMaterial.id);
            expect(response.body).toHaveProperty('name', 'Test Material');
        });

        it('should return 404 if material is not found', async () => {
            const nonExistentId = 99999;
            const response = await request(app)
                .get(`/api/v1/materials/${nonExistentId}`)
                .set('Authorization', `Bearer ${userToken}`);

            expect(response.statusCode).toBe(404);
        });
    });

    describe('POST /api/v1/materials', () => {
        it('should create a new material when user is admin', async () => {
            const newMaterial = { name: 'New Material' };
            const response = await request(app)
                .post('/api/v1/materials')
                .set('Authorization', `Bearer ${adminToken}`)
                .send(newMaterial);

            expect(response.statusCode).toBe(201);
            expect(response.body).toHaveProperty('name', 'New Material');
        });

        it('should return 403 when user is not admin', async () => {
            const newMaterial = { name: 'New Material' };
            const response = await request(app)
                .post('/api/v1/materials')
                .set('Authorization', `Bearer ${userToken}`)
                .send(newMaterial);

            expect(response.statusCode).toBe(403);
        });
    });

    describe('PATCH /api/v1/materials/:id', () => {
        it('should update a material when user is admin', async () => {
            const updateData = { name: 'Updated Material' };
            const response = await request(app)
                .patch(`/api/v1/materials/${testMaterial.id}`)
                .set('Authorization', `Bearer ${adminToken}`)
                .send(updateData);

            expect(response.statusCode).toBe(200);
            expect(response.body).toHaveProperty('name', 'Updated Material');
        });

        it('should return 403 when user is not admin', async () => {
            const updateData = { name: 'Updated Material' };
            const response = await request(app)
                .patch(`/api/v1/materials/${testMaterial.id}`)
                .set('Authorization', `Bearer ${userToken}`)
                .send(updateData);

            expect(response.statusCode).toBe(403);
        });

        it('should return 404 if material to update is not found', async () => {
            const nonExistentId = 99999;
            const updateData = { name: 'Updated Material' };
            const response = await request(app)
                .patch(`/api/v1/materials/${nonExistentId}`)
                .set('Authorization', `Bearer ${adminToken}`)
                .send(updateData);

            expect(response.statusCode).toBe(404);
        });
    });

    describe('DELETE /api/v1/materials/:id', () => {
        it('should delete a material when user is admin', async () => {
            const response = await request(app)
                .delete(`/api/v1/materials/${testMaterial.id}`)
                .set('Authorization', `Bearer ${adminToken}`);

            expect(response.statusCode).toBe(204);

            const deletedMaterial = await Material.findByPk(testMaterial.id);
            expect(deletedMaterial).toBeNull();
        });

        it('should return 403 when user is not admin', async () => {
            const response = await request(app)
                .delete(`/api/v1/materials/${testMaterial.id}`)
                .set('Authorization', `Bearer ${userToken}`);

            expect(response.statusCode).toBe(403);
        });

        it('should return 404 if material to delete is not found', async () => {
            const nonExistentId = 99999;
            const response = await request(app)
                .delete(`/api/v1/materials/${nonExistentId}`)
                .set('Authorization', `Bearer ${adminToken}`);

            expect(response.statusCode).toBe(404);
        });
    });
});