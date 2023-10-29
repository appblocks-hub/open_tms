import { shared } from '@appblocks/node-sdk';

jest.mock('@appblocks/node-sdk', () => {
    return {
        shared: {
            getShared: jest.fn(() => ({
                prisma: {
                    ticket_types: {
                        findFirst: jest.fn(),
                        create: jest.fn(),
                    },
                    $queryRaw: jest.fn(),
                },
                isEmpty: jest.fn(),
                validateRequestMethod: jest.fn(),
                checkHealth: jest.fn(),
                sendResponse: jest.fn(),
            })),
        },
    };
});

describe('handler', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('should return a 200 response when a valid ticket type is created by an admin', async () => {
        const event = {
            req: {
                body: {
                    label: 'Support',
                },
                user: {
                    id: 'adminUserId',
                },
            },
            res: {},
        };

        const { prisma, sendResponse, $queryRaw } = shared.getShared();

        $queryRaw.mockResolvedValue([{ organisation_id: 'orgId' }]);
        prisma.ticket_types.findFirst.mockResolvedValue(null);
        prisma.ticket_types.create.mockResolvedValue({});

        await handler(event);

        expect(prisma.ticket_types.findFirst).toHaveBeenCalledTimes(1);
        expect(prisma.ticket_types.create).toHaveBeenCalledWith({
            data: {
                organisation_id: 'orgId',
                created_by: 'adminUserId',
                label: 'Support',
            },
        });
        expect(sendResponse).toHaveBeenCalledWith({}, 200, {
            message: 'Successfully created ticket type',
        });
    });

    it('should return a 400 response when ticket type label is already taken', async () => {
        const event = {
            req: {
                body: {
                    label: 'Support',
                },
                user: {
                    id: 'adminUserId',
                },
            },
            res: {},
        };

        const { prisma, sendResponse, $queryRaw } = shared.getShared();

        $queryRaw.mockResolvedValue([{ organisation_id: 'orgId' }]);
        prisma.ticket_types.findFirst.mockResolvedValue({ label: 'Support' });

        await handler(event);

        expect(prisma.ticket_types.findFirst).toHaveBeenCalledTimes(1);
        expect(prisma.ticket_types.create).not.toHaveBeenCalled();
        expect(sendResponse).toHaveBeenCalledWith({}, 400, {
            message: 'Ticket type already exists.',
        });
    });

    it('should return a 401 response when the user is not an admin', async () => {
        const event = {
            req: {
                body: {
                    label: 'Support',
                },
                user: {
                    id: 'nonAdminUserId',
                },
            },
            res: {},
        };

        const { prisma, sendResponse, $queryRaw } = shared.getShared();

        $queryRaw.mockResolvedValue([]);

        await handler(event);

        expect(prisma.ticket_types.findFirst).not.toHaveBeenCalled();
        expect(prisma.ticket_types.create).not.toHaveBeenCalled();
        expect(sendResponse).toHaveBeenCalledWith({}, 401, {
            message: 'Unauthorized access',
        });
    });

    it('should return a 400 response when required input is missing', async () => {
        const event = {
            req: {
                body: {},
                user: {
                    id: 'adminUserId',
                },
            },
            res: {},
        };

        const { prisma, sendResponse, $queryRaw } = shared.getShared();

        await handler(event);

        expect(prisma.ticket_types.findFirst).not.toHaveBeenCalled();
        expect(prisma.ticket_types.create).not.toHaveBeenCalled();
        expect(sendResponse).toHaveBeenCalledWith({}, 400, {
            message: 'Please provide valid input',
        });
    });

    it('should return a 500 response when an error occurs', async () => {
        const event = {
            req: {
                body: {
                    label: 'Support',
                },
                user: {
                    id: 'adminUserId',
                },
            },
            res: {},
        };

        const { sendResponse } = shared.getShared();

        const errorMessage = 'Error';
        handler = async (event) => {
            throw new Error(errorMessage);
        };

        await handler(event);

        expect(sendResponse).toHaveBeenCalledWith({}, 500, {
            message: 'Something went wrong.',
        });
    });

});
