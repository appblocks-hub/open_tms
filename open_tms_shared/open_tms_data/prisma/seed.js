import { PrismaClient } from '@prisma/client'
import { createUser, createPredefinedRoles, createMemberUsers,inviteMemberUsersToOrganisation,createDepartmentsAndAddUsers,createProcess,createTicket,updateTicket} from './seeder/initial.seed.js'

const prisma = new PrismaClient()

async function main() {
  await createPredefinedRoles(prisma)
  await createUser(prisma)
  await createMemberUsers(prisma)
  await inviteMemberUsersToOrganisation(prisma)
  await createDepartmentsAndAddUsers(prisma)

  await createProcess(prisma)
  await createTicket(prisma)
  await updateTicket(prisma)
}

main()
  .catch((e) => {
    console.log('e', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
