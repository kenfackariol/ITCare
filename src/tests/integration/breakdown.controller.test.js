const breakdownController = require('@src/controllers/breakdownController');
const breakdownService = require('@src/services/breakdownService');
const { catchAsync } = require('@src/utils/catchAsync');

// Mock the breakdownService
jest.mock('@src/services/breakdownService');

describe('Breakdown Controller', () => {
    // Helper function to mock the response object
    const mockResponse = () => {
        const res = {};
        res.status = jest.fn().mockReturnThis();
        res.json = jest.fn().mockReturnThis();
        res.end = jest.fn().mockReturnThis();
        return res;
    };

    beforeEach(() => {
        jest.clearAllMocks();
    });

    describe('createBreakdown', () => {
        it('should create a breakdown and return it with status 201', async () => {
            const req = {
                body: {
                    name_requester: 'John Doe',
                    direction_requester: 'North Wing',
                    door_requester: 'A101',
                    name_responsable: 'Jane Smith',
                    serial_number: 'SN12345',
                    model: 'Model X',
                    os: 'Windows 10',
                    observation: 'Screen flickering',
                    start_date_intervention: '2023-06-01T10:00:00Z',
                    end_date_intervention: '2023-06-01T11:30:00Z',
                    type_intervention: 'Hardware Repair',
                    designation_CR: 'CR-2023-001',
                    materialId: 1
                },
                user: { id: 1 }
            };
            const res = mockResponse();
            const breakdown = {
                id: 1,
                ...req.body,
                userId: 1,
                createdAt: expect.any(String),
                updatedAt: expect.any(String)
            };

            breakdownService.createBreakdown.mockResolvedValue(breakdown);

            await breakdownController.createBreakdown(req, res);

            expect(breakdownService.createBreakdown).toHaveBeenCalledWith(req.body, req.user.id);
            expect(res.status).toHaveBeenCalledWith(201);
            expect(res.json).toHaveBeenCalledWith(breakdown);
        });
    });

    describe('getAllBreakdowns', () => {
        it('should return all breakdowns with status 200', async () => {
            const req = {};
            const res = mockResponse();
            const breakdowns = [{ id: 1, name_requester: 'John Doe' }];

            breakdownService.getAllBreakdowns.mockResolvedValue(breakdowns);

            await breakdownController.getAllBreakdowns(req, res);

            expect(breakdownService.getAllBreakdowns).toHaveBeenCalled();
            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith(breakdowns);
        });
    });

    describe('getBreakdownById', () => {
        it('should return a breakdown by ID with status 200', async () => {
          const req = {
            params: { id: 1 }
          };
          const res = mockResponse();
          const breakdown = { id: 1, name_requester: 'John Doe' };
      
          breakdownService.readBreakdown.mockResolvedValue(breakdown);
      
          await breakdownController.getBreakdownById(req, res);
      
          expect(breakdownService.readBreakdown).toHaveBeenCalledWith(1);
          expect(res.status).toHaveBeenCalledWith(200);
          expect(res.json).toHaveBeenCalledWith(breakdown);
        });
      });

    describe('updateBreakdown', () => {
        it('should update a breakdown and return it with status 200', async () => {
            const req = {
                params: { id: 1 },
                body: { name_requester: 'Jane Doe' }
            };
            const res = mockResponse();
            const updatedBreakdown = { id: 1, name_requester: 'Jane Doe' };

            breakdownService.updateBreakdown.mockResolvedValue(updatedBreakdown);

            await breakdownController.updateBreakdown(req, res);

            expect(breakdownService.updateBreakdown).toHaveBeenCalledWith(1, req.body);
            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith(updatedBreakdown);
        });
    });

    describe('deleteBreakdown', () => {
        it('should delete a breakdown and return status 204', async () => {
            const req = {
                params: { id: 1 }
            };
            const res = mockResponse();

            breakdownService.deleteBreakdown.mockResolvedValue();

            await breakdownController.deleteBreakdown(req, res);

            expect(breakdownService.deleteBreakdown).toHaveBeenCalledWith(1);
            expect(res.status).toHaveBeenCalledWith(204);
            expect(res.end).toHaveBeenCalled();
        });
    });

    describe('getBreakdownsByDateRange', () => {
        it('should return breakdowns by date range with status 200', async () => {
            const req = {
                params: { startDate: '2023-01-01', endDate: '2023-12-31' }
            };
            const res = mockResponse();
            const breakdowns = [{ id: 1, name_requester: 'John Doe' }];

            breakdownService.getBreakdownsByDateRange.mockResolvedValue(breakdowns);

            await breakdownController.getBreakdownsByDateRange(req, res);

            expect(breakdownService.getBreakdownsByDateRange).toHaveBeenCalledWith('2023-01-01', '2023-12-31');
            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith(breakdowns);
        });
    });

    describe('getBreakdownsByRequester', () => {
        it('should return breakdowns by requester with status 200', async () => {
            const req = {
                params: { requesterName: 'John Doe' }
            };
            const res = mockResponse();
            const breakdowns = [{ id: 1, name_requester: 'John Doe' }];

            breakdownService.getBreakdownsByRequester.mockResolvedValue(breakdowns);

            await breakdownController.getBreakdownsByRequester(req, res);

            expect(breakdownService.getBreakdownsByRequester).toHaveBeenCalledWith('John Doe');
            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith(breakdowns);
        });
    });

    describe('getBreakdownsByUser', () => {
        it('should return breakdowns by user with status 200', async () => {
            const req = {
                params: { userId: '1' }
            };
            const res = mockResponse();
            const breakdowns = [{ id: 1, name_requester: 'John Doe', userId: 1 }];

            breakdownService.getBreakdownsByUser.mockResolvedValue(breakdowns);

            await breakdownController.getBreakdownsByUser(req, res);

            expect(breakdownService.getBreakdownsByUser).toHaveBeenCalledWith('1');
            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith(breakdowns);
        });
    });
});