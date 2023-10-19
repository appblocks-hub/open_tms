# Contribution Guidelines

## Prerequisites

1. You need a Linux/Unix machine.
2. Node.js must be installed.Node version of 16 is needed.
3. Docker engine and Docker Compose must be installed.
4. Understanding of block architecture and function block development is required. Please check the docs [here](https://docs.appblocks.com)

The entire project is built using appblocks tooling. For each issue posted, certain function blocks need to be built.

## Setup Steps

1. Fork the repository and pull it to your local machine.
2. Install `@appblocks/bb-cli` from the npm registry.
3. Change to the project directory.
4. Create a .env.function file in the root directory and add the variables from .sample.env.function.
5. Run the following commands:

```
docker-compose up
cd open_tms_shared/open_tms_data
npm i
npm run db:push
npm run prisma:seed:dev
```

This will set up the database in your local machine with seed data.

## Contributing Process

1. Identify an issue you want to work on and check [here](https://github.com/appblocks-hub/challenges) 
2. Just let us know that you are working on the issue, See the already raised PRs as well. We will be evaluating all PRs and swags will be given to those who raise the best PRs first, before 29th of October.
3. Check the issue you are working on and refer to the issue description to understand the intended workflow.
4. Understand the database schema and function block requirements.
5. Use of proper documentations and writing test cases(please refer our docs for running test cases with Jest) will give you more chances.
6. Using shared block inside function blocks.

Shared blocks are global blocks that can be utilized across all other function blocks. Functions exported from shared blocks can be accessed in any function block using `@appblocks/node-sdk`. Below is a code snippet illustrating this:

```
import { shared } from "@appblocks/node-sdk";

const handler = async ({ req, res }) => {
 const { prisma } = await shared.getShared();
}

```

6. Using middleware block inside function blocks

To incorporate custom middleware, you can create a function block and assign it as middleware in the block.config.json file.
 
Note: Middleware functions should return true to be continued to next, else the api will be exited from that middleware

Here's the format for specifying middlewares in the function block's config.json:
```
      {
        //...rest block.config.json
        "middlewares": [middlewareName]
      }
```
Format to pass middlewares in package block.config.json
```
      {
        //...rest block.config.json
        "middlewares": [
          {
            "executeOnBlocks": [], // Optional : if empty all functions are considered
            "middlewaresList": ["midBlockCommon"]
          },
          {
            "executeOnBlocks": ["fnBlockA", "fnBlockB"],
            "middlewaresList": ["midBlockA"]
          }
        ],
      }
```
Specific middlewares for blocks can be whitelisted by passing the block_name in the whitelist array in the middleware source code.

The order of middleware execution follows the order in which they are defined in the array. For package-level middlewares (at the start of the package), they will be executed before the middlewares defined in the block's configuration.

7. Complete the task and perform a git push.
8. Raise a pull request against the original repository's main branch.


9. Sample api docs sample for a function block is

```
/**
 * @swagger
 * /rootPackageName/function1:
 *   post:
 *     summary: Retrieve a list of JSONPlaceholder users for function1
 *     description: Retrieve a list of users from JSONPlaceholder.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               parameter1:
 *                 type: string
 *     responses:
 *        '201':
 *          description: Created
 *        '200':
 *          description: Ok
 *
*/
```

The docs can viewed via the function_url/docs route.


10. Please do add unit tests in separate test.spec file.Please use jest as test runner framework.Its preferrable.
