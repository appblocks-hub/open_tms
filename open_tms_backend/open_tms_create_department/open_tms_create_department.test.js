import handler from './index';
import { shared } from '@appblocks/node-sdk';

jest.mock('@appblocks/node-sdk', () => {
    return {
        shared: {
            getShared: jest.fn(() => ({
                prisma: {
                    department: {
                        findFirst: jest.fn(),
                        create: jest.fn(),
                    },
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

    it('should return a 200 response when a valid department is created', async () => {
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

        const { prisma, sendResponse } = shared.getShared();

        prisma.department.findFirst.mockResolvedValue(null);
        prisma.department.create.mockResolvedValue({});

        await handler(event);

        expect(prisma.department.findFirst).toHaveBeenCalledTimes(2);
        expect(prisma.department.create).toHaveBeenCalledWith({
            data: {
                name: 'Operations',
                display_name: 'People Operations',
                id: '2e6b588f-2cb8-4bb6-a0c8-414651ab9b62',
            },
        });
        expect(sendResponse).toHaveBeenCalledWith({}, 200, {
            message: 'Successfully created department',
        });
    });

    it('should return a 400 response when department name is already taken', async () => {
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

        const { prisma, sendResponse } = shared.getShared();

        prisma.department.findFirst.mockResolvedValue({});
        prisma.department.create.mockResolvedValue({});

        await handler(event);

        expect(prisma.department.findFirst).toHaveBeenCalledTimes(1);
        expect(prisma.department.create).not.toHaveBeenCalled();
        expect(sendResponse).toHaveBeenCalledWith({}, 400, {
            message: 'Department with similar name already exists.',
        });
    });

    it('should return a 400 response when org member is already associated with another department', async () => {
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

        const { prisma, sendResponse } = shared.getShared();

        prisma.department.findFirst.mockResolvedValue(null);
        prisma.department.create.mockResolvedValue(null); // Assuming org member not found

        await handler(event);

        expect(prisma.department.findFirst).toHaveBeenCalledTimes(2);
        expect(prisma.department.create).not.toHaveBeenCalled();
        expect(sendResponse).toHaveBeenCalledWith({}, 400, {
            message: 'Organization member is already associated with another department.',
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
