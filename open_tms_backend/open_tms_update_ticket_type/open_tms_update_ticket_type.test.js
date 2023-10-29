import { shared } from '@appblocks/node-sdk';
import handler from './index';

jest.mock('@appblocks/node-sdk', () => {
    return {
        shared: {
            getShared: jest.fn(() => ({
                prisma: {
                    ticket_types: {
                        findFirst: jest.fn(),
                        update: jest.fn(),
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

    it('should return a 200 response when a valid ticket type is updated by an admin', async () => {
        const event = {
            req: {
                body: {
                    ticket_type_id: '81f9a658-9b1a-4cf5-ba94-460411ec9bb9',
                    label: 'New Label',
                },
                user: {
                    id: 'adminUserId',
                },
            },
            res: {},
        };

        const { prisma, sendResponse, $queryRaw } = shared.getShared();

        prisma.ticket_types.findFirst.mockResolvedValue({ id: '81f9a658-9b1a-4cf5-ba94-460411ec9bb9' });
        $queryRaw.mockResolvedValue([{ isadmin: true }]);
        prisma.ticket_types.update.mockResolvedValue({});

        await handler(event);

        expect(prisma.ticket_types.findFirst).toHaveBeenCalledTimes(1);
        expect(prisma.ticket_types.update).toHaveBeenCalledWith({
            where: { id: '81f9a658-9b1a-4cf5-ba94-460411ec9bb9' },
            data: {
                label: 'New Label',
                updated_by: 'adminUserId',
            },
        });
        expect(sendResponse).toHaveBeenCalledWith({}, 200, {
            message: 'Successfully updated ticket type',
        });
    });

    it('should return a 400 response when ticket type id is invalid', async () => {
        const event = {
            req: {
                body: {
                    ticket_type_id: 'invalidId',
                    label: 'New Label',
                },
                user: {
                    id: 'adminUserId',
                },
            },
            res: {},
        };

        const { prisma, sendResponse, $queryRaw } = shared.getShared();

        prisma.ticket_types.findFirst.mockResolvedValue(null);

        await handler(event);

        expect(prisma.ticket_types.findFirst).toHaveBeenCalledTimes(1);
        expect(prisma.ticket_types.update).not.toHaveBeenCalled();
        expect(sendResponse).toHaveBeenCalledWith({}, 400, {
            message: 'Ticket type id is invalid.',
        });
    });

    it('should return a 401 response when the user is not an admin', async () => {
        const event = {
            req: {
                body: {
                    ticket_type_id: '81f9a658-9b1a-4cf5-ba94-460411ec9bb9',
                    label: 'New Label',
                },
                user: {
                    id: 'nonAdminUserId',
                },
            },
            res: {},
        };

        const { prisma, sendResponse, $queryRaw } = shared.getShared();

        prisma.ticket_types.findFirst.mockResolvedValue({ id: '81f9a658-9b1a-4cf5-ba94-460411ec9bb9' });
        $queryRaw.mockResolvedValue([{ isadmin: false }]);

        await handler(event);

        expect(prisma.ticket_types.findFirst).toHaveBeenCalledTimes(1);
        expect(prisma.ticket_types.update).not.toHaveBeenCalled();
        expect(sendResponse).toHaveBeenCalledWith({}, 401, {
            message: 'Unauthorized access',
        });
    });

    it('should return a 400 response when required input is missing', async () => {
        const event = {
            req: {
                body: {
                    label: 'New Label',
                },
                user: {
                    id: 'adminUserId',
                },
            },
            res: {},
        };

        const { prisma, sendResponse, $queryRaw } = shared.getShared();

        await handler(event);

        expect(prisma.ticket_types.findFirst).not.toHaveBeenCalled();
        expect(prisma.ticket_types.update).not.toHaveBeenCalled();
        expect(sendResponse).toHaveBeenCalledWith({}, 400, {
            message: 'Please provide valid input',
        });
    });

    it('should return a 500 response when an error occurs', async () => {
        const event = {
            req: {
                body: {
                    name: 'Operations',
                    display_name: 'People Operations',
                    org_member_id: '2e6b588f-2cb8-4bb6-a0c8-414651ab9b62',
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
