# Contribution Guidelines

## Prerequisites
1. You need a Linux/Unix machine.
2. Node.js must be installed.
3. Docker engine and Docker Compose must be installed.
4. Understanding of block architecture and function block development is required.

The entire project is built using appblocks tooling. For each issue posted, certain function blocks need to be built.

## Setup Steps
1. Fork the repository and pull it to your local machine.
2. Install `@appblocks/bb-cli` from the npm registry.
3. Change to the project directory.
4. Run the following commands:

```
docker-compose up
cd backend/open_tms_data
prisma generate
prisma migrate dev
prisma
node prisma/seed.js

```
This will set up the database in your local machine with seed data.

## Contributing Process
1. Identify an issue you want to work on and check [here](https://github.com/appblocks-hub/challenges) to see if the issue is still unassigned
2. Ask in the issue comment for getting the task assigned to you
3. Check the issue you are working on and refer to the issue description to understand the intended workflow.
4. Understand the database schema and function block requirements.
5. Complete the task and perform a git push.
6. Raise a pull request against the original repository's main branch.
