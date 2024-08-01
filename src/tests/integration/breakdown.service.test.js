const BreakdownService = require('@src/services/breakdownService');
const Breakdown = require('@src/models/Breakdown');
const AppError = require('@src/utils/appError');

// Mock the Breakdown model
jest.mock('@src/models/Breakdown');

describe('BreakdownService', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    describe('createBreakdown', () => {
        it('should create a breakdown and return it', async () => {
            const data = {
                name_requester: 'John Doe',
                materialId: 1
            };
            const userId = 1;
            const createdBreakdown = { id: 1, ...data, userId, createdAt: expect.any(Date), updatedAt: expect.any(Date) };

            Breakdown.create.mockResolvedValue(createdBreakdown);

            const result = await BreakdownService.createBreakdown(data, userId);

            expect(Breakdown.create).toHaveBeenCalledWith({
                ...data,
                userId,
                createdAt: expect.any(Date),
                updatedAt: expect.any(Date)
            });
            expect(result).toEqual(createdBreakdown);
        });

        it('should create a breakdown with optional fields', async () => {
            const data = {
                name_requester: 'John Doe',
                materialId: 1,
                direction_requester: 'North',
                door_requester: 'A1',
                name_responsable: 'Jane Smith',
                serial_number: 'SN123456',
                model: 'Model X',
                os: 'Windows 10',
                observation: 'Minor issue',
                start_date_intervention: new Date('2023-01-01'),
                end_date_intervention: new Date('2023-01-10'),
                type_intervention: 'Repair',
                designation_CR: 'CR001'
            };
            const userId = 1;
            const createdBreakdown = { id: 1, ...data, userId, createdAt: expect.any(Date), updatedAt: expect.any(Date) };

            Breakdown.create.mockResolvedValue(createdBreakdown);

            const result = await BreakdownService.createBreakdown(data, userId);

            expect(Breakdown.create).toHaveBeenCalledWith({
                ...data,
                userId,
                createdAt: expect.any(Date),
                updatedAt: expect.any(Date)
            });
            expect(result).toEqual(createdBreakdown);
        });

        it('should throw an error if validation fails', async () => {
            const invalidData = { name_requester: '' };
            const userId = 1;

            await expect(BreakdownService.createBreakdown(invalidData, userId))
                .rejects
                .toThrow(AppError);
        });
    });

    describe('readBreakdown', () => {
        it('should return a breakdown by ID', async () => {
            const breakdown = { id: 1, name_requester: 'John Doe' };

            Breakdown.findByPk.mockResolvedValue(breakdown);

            const result = await BreakdownService.readBreakdown(1);

            expect(Breakdown.findByPk).toHaveBeenCalledWith(1);
            expect(result).toEqual(breakdown);
        });

        it('should throw an error if breakdown is not found', async () => {
            Breakdown.findByPk.mockResolvedValue(null);

            await expect(BreakdownService.readBreakdown(1))
                .rejects
                .toThrow(AppError);
        });
    });

    describe('updateBreakdown', () => {
        it('should update a breakdown and return it', async () => {
            const id = 1;
            const data = { name_requester: 'Jane Doe', materialId: 2 };
            const updatedBreakdown = { id, ...data, updatedAt: expect.any(Date) };
    
            const mockBreakdown = {
                update: jest.fn().mockResolvedValue(updatedBreakdown),
                ...updatedBreakdown  // Add this line
            };
    
            Breakdown.findByPk.mockResolvedValue(mockBreakdown);
    
            const result = await BreakdownService.updateBreakdown(id, data);
    
            expect(Breakdown.findByPk).toHaveBeenCalledWith(id);
            expect(mockBreakdown.update).toHaveBeenCalledWith({
                ...data,
                updatedAt: expect.any(Date)
            });
            expect(result).toEqual(mockBreakdown);  // Change this line
        });

        it('should update a breakdown with optional fields', async () => {
            const id = 1;
            const data = {
                name_requester: 'Jane Doe',
                materialId: 2,
                direction_requester: 'South',
                door_requester: 'B2',
                name_responsable: 'John Smith',
                serial_number: 'SN654321',
                model: 'Model Y',
                os: 'MacOS',
                observation: 'Major issue',
                start_date_intervention: new Date('2023-02-01'),
                end_date_intervention: new Date('2023-02-10'),
                type_intervention: 'Replacement',
                designation_CR: 'CR002'
            };
            const updatedBreakdown = { id, ...data, updatedAt: expect.any(Date) };
    
            const mockBreakdown = {
                update: jest.fn().mockResolvedValue(updatedBreakdown),
                ...updatedBreakdown  // Add this line
            };
    
            Breakdown.findByPk.mockResolvedValue(mockBreakdown);
    
            const result = await BreakdownService.updateBreakdown(id, data);
    
            expect(Breakdown.findByPk).toHaveBeenCalledWith(id);
            expect(mockBreakdown.update).toHaveBeenCalledWith({
                ...data,
                updatedAt: expect.any(Date)
            });
            expect(result).toEqual(mockBreakdown);  // Change this line
        });

        it('should throw an error if breakdown is not found', async () => {
            Breakdown.findByPk.mockResolvedValue(null);

            await expect(BreakdownService.updateBreakdown(1, {}))
                .rejects
                .toThrow(AppError);
        });
    });

    describe('deleteBreakdown', () => {
        it('should delete a breakdown and return a success message', async () => {
            const mockBreakdown = {
                destroy: jest.fn().mockResolvedValue()
            };

            Breakdown.findByPk.mockResolvedValue(mockBreakdown);

            const result = await BreakdownService.deleteBreakdown(1);

            expect(Breakdown.findByPk).toHaveBeenCalledWith(1);
            expect(mockBreakdown.destroy).toHaveBeenCalled();
            expect(result).toEqual({ message: 'Breakdown deleted successfully' });
        });

        it('should throw an error if breakdown is not found', async () => {
            Breakdown.findByPk.mockResolvedValue(null);

            await expect(BreakdownService.deleteBreakdown(1))
                .rejects
                .toThrow(AppError);
        });
    });

    describe('getBreakdownsByDateRange', () => {
        it('should return breakdowns within a date range', async () => {
            const breakdowns = [{ id: 1 }, { id: 2 }];
            const startDate = '2023-01-01';
            const endDate = '2023-12-31';

            Breakdown.findByDateRange.mockResolvedValue(breakdowns);

            const result = await BreakdownService.getBreakdownsByDateRange(startDate, endDate);

            expect(Breakdown.findByDateRange).toHaveBeenCalledWith(startDate, endDate);
            expect(result).toEqual(breakdowns);
        });
    });

    describe('getBreakdownsByRequester', () => {
        it('should return breakdowns by requester name', async () => {
            const breakdowns = [{ id: 1 }, { id: 2 }];
            const requesterName = 'John Doe';

            Breakdown.findByRequester.mockResolvedValue(breakdowns);

            const result = await BreakdownService.getBreakdownsByRequester(requesterName);

            expect(Breakdown.findByRequester).toHaveBeenCalledWith(requesterName);
            expect(result).toEqual(breakdowns);
        });
    });

    describe('getBreakdownsByUser', () => {
        it('should return breakdowns by user ID', async () => {
            const breakdowns = [{ id: 1 }, { id: 2 }];
            const userId = 1;

            Breakdown.findByUser.mockResolvedValue(breakdowns);

            const result = await BreakdownService.getBreakdownsByUser(userId);

            expect(Breakdown.findByUser).toHaveBeenCalledWith(userId);
            expect(result).toEqual(breakdowns);
        });
    });


    describe('getAllBreakdowns', () => {
        it('should return all breakdowns', async () => {
            const breakdowns = [{ id: 1 }, { id: 2 }];

            Breakdown.findAll.mockResolvedValue(breakdowns);

            const result = await BreakdownService.getAllBreakdowns();

            expect(Breakdown.findAll).toHaveBeenCalled();
            expect(result).toEqual(breakdowns);
        });
    });
});