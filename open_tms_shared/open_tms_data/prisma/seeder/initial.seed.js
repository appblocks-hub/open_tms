import { hash, genSalt } from 'bcrypt'

const tenantID = '71df8bec-075a-48a0-9ea7-6d5f85de729c'
const organisationUserID = 'd68fae1a-9da6-4f62-b700-97fb2c73502d'

const userEmailID = 'da382b30-1a49-4ab4-89c5-033b39288d96'

const userAuthenticationInfoID = '4ab2a9d6-789c-4d97-9fb9-162fa226f649'

const organisationID = '090c4951-217d-4513-b016-49ed085d24d1'

const orgMemberID = '205d80a2-e8ed-4061-b09b-e0d1e9c11133'

const assigneeRoleID = '82f68fb9-c53a-4a05-a94a-2213a7ac72c2'

const memberRoleID = 'ab6c41b5-1e05-4c5c-9bcf-ffda4f5d4ea6'

const operationsDepartmentID = '7b2870ab-1324-4a42-abf3-d8a7b6b5020e'

const hRDepartmentID = '979bc3e2-a2f5-431a-8080-e36952c9b95d'

const hrDepartmentOrgMemberID='0cc0354e-152a-4dcf-ae91-25a761598bbe'

const operationsDepartmentOrgMemberID='2e6b588f-2cb8-4bb6-a0c8-414651ab9b62'

const memberUser1ID = 'ac7b018f-ec8f-448e-a50a-b0a47fb678d4'

const orgMemberUser1ID = '940c365b-b75b-4fc9-a0c4-c0e6c8496539'

const orgMemberRolesUser1ID = '74049637-630e-46b0-8f8b-1f0cc754fb93'

const departmentUser1ID = 'a50ea42f-ba55-4c18-813a-0492b59863e2'


const memberUser2ID = 'e906b6f6-f609-40d9-b2e0-c263d541669b'

const orgMemberUser2ID = 'bc038273-e433-45f7-953a-605fcc95bb27'

const orgMemberRolesUser2ID = '74d1ab12-e32b-4168-87d5-91644b3b0ce6'

const departmentUser2ID = '9816aa00-13ea-4ece-9893-a408599bb8f0'

const memberUser3ID = '6e7ddb72-3dba-4d1a-99fe-5a09d2914c6e'

const orgMemberUser3ID = 'c5ac3afd-8d9c-43a4-b6e2-eebec755151b'

const orgMemberRolesUser3ID = '07f264b0-7e24-4967-8b4a-5a2a5bff82ef'

const departmentUser3ID = '865dfd85-ab3c-493b-8aea-2a194df9b7f1'

const memberUser4ID = '3ac14aca-0e57-4506-90fe-6b476d81117a'

const orgMemberUser4ID = '1a4cc4a7-305b-41a6-bcef-fe15bec56a41'

const orgMemberRolesUser4ID = 'ea0dd9c3-4c4e-430d-a028-e47ff9685946'

const departmentUser4ID = '2de50fb1-1e12-4064-9f9b-72b9d8c6b27a'

async function createUser(prisma) {
  const tenant = await prisma.tenant.upsert({
    where: {
      id: tenantID,
    },
    update: {},
    create: {
      id: tenantID,
      name: 'Appblocks',
      display_name: 'Appblocks',
    },
  })

  console.log('tenant is \n', tenant)

  const user = await prisma.user.upsert({
    where: {
      id: organisationUserID,
    },
    update: {},
    create: {
      id: organisationUserID,
      first_name: 'Appblocks',
      middle_name: '',
      last_name: 'Admin',
      country_code: '+91',
      phn_no: '1234567',
      display_name: 'Appblocks Admin',
    },
  })

  console.log('user is \n', user)

  await prisma.user_email.upsert({
    where: {
      id: userEmailID,
    },
    update: {},
    create: {
      id: userEmailID,
      email: 'appblocksAdmin@mailinator.com',
      user_id: user.id,
      email_type: 0,
    },
  })

  const salt = await genSalt(10)
  const password = await hash('Admin@01', 10)

  await prisma.user_authentication_info.upsert({
    where: {
      id: userAuthenticationInfoID,
    },
    update: {},
    create: {
      id: userAuthenticationInfoID,
      user_id: user.id,
      password_hash: password,
      password_salt: salt,
    },
  })

  const organisation = await prisma.organisation.upsert({
    where: {
      id: organisationID,
    },
    update: {},
    create: {
      id: organisationID,
      tenant_id: tenant.id,
      name: user.first_name,
      display_name: user.first_name,
      created_by: user.id,
      // password_hash: password,
      // password_salt: salt,
    },
  })

  console.log('organisation is \n', organisation)

  const org_member = await prisma.org_member.upsert({
    where: {
      id: orgMemberID,
    },
    update: {},
    create: {
      id: orgMemberID,
      organisation_id: organisation.id,
      created_by: user.id,
      type: 1,
    },
  })

  console.log('org member is \n', org_member)

  const org_member_roles = await prisma.org_member_roles.upsert({
    where: {
      id: org_member.id,
    },
    update: {},
    create: {
      id: org_member.id,
      role_id: assigneeRoleID,
      user_id: user.id,
    },
  })
}

async function createPredefinedRoles(prisma) {
  const assigneeRole = await prisma.roles.upsert({
    where: {
      id: assigneeRoleID,
    },
    update: {},
    create: {
      id: assigneeRoleID,
      name: 'role-assignee',
      display_name: 'role-assignee',
    },
  })

  const memberRole = await prisma.roles.upsert({
    where: {
      id: memberRoleID,
    },
    update: {},
    create: {
      id: memberRoleID,
      name: 'member',
      display_name: 'member',
    },
  })

}

async function createMemberUsers(prisma) {
  const memberUser1 = await prisma.user.upsert({
    where: {
      id: memberUser1ID,
    },
    update: {},
    create: {
      id: memberUser1ID,
      first_name: 'Member',
      middle_name: '',
      last_name: 'User 1',
      country_code: '+91',
      display_name: 'Member User 1',
    },
  })

  const memberUser2 = await prisma.user.upsert({
    where: {
      id: memberUser2ID,
    },
    update: {},
    create: {
      id: memberUser2ID,
      first_name: 'Member',
      middle_name: '',
      last_name: 'User 2',
      country_code: '+91',
      display_name: 'Member User 2',
    },
  })

  const memberUser3 = await prisma.user.upsert({
    where: {
      id: memberUser3ID,
    },
    update: {},
    create: {
      id: memberUser3ID,
      first_name: 'Member',
      middle_name: '',
      last_name: 'User 3',
      country_code: '+91',
      display_name: 'Member User 3',
    },
  })

  const memberUser4 = await prisma.user.upsert({
    where: {
      id: memberUser4ID,
    },
    update: {},
    create: {
      id: memberUser4ID,
      first_name: 'Member',
      middle_name: '',
      last_name: 'User 4',
      country_code: '+91',
      display_name: 'Member User 4',
    },
  })
}

async function inviteMemberUsersToOrganisation(prisma) {
  const org_member1 = await prisma.org_member.upsert({
    where: {
      id: orgMemberUser1ID,
    },
    update: {},
    create: {
      id: orgMemberUser1ID,
      organisation_id: organisationID,
      created_by: organisationUserID,
      type: 1,
    },
  })


  const org_member_roles1 = await prisma.org_member_roles.upsert({
    where: {
      id: orgMemberUser1ID,
    },
    update: {},
    create: {
      id: orgMemberUser1ID,
      role_id: memberRoleID,
      user_id: organisationUserID,
    },
  })

  const org_member2 = await prisma.org_member.upsert({
    where: {
      id: orgMemberUser2ID,
    },
    update: {},
    create: {
      id: orgMemberUser2ID,
      organisation_id: organisationID,
      created_by: organisationUserID,
      type: 1,
    },
  })


  const org_member_roles2 = await prisma.org_member_roles.upsert({
    where: {
      id: orgMemberUser2ID,
    },
    update: {},
    create: {
      id: orgMemberUser2ID,
      role_id: memberRoleID,
      user_id: organisationUserID,
    },
  })

  const org_member3 = await prisma.org_member.upsert({
    where: {
      id: orgMemberUser3ID,
    },
    update: {},
    create: {
      id: orgMemberUser3ID,
      organisation_id: organisationID,
      created_by: organisationUserID,
      type: 1,
    },
  })


  const org_member_roles3 = await prisma.org_member_roles.upsert({
    where: {
      id: orgMemberUser3ID,
    },
    update: {},
    create: {
      id: orgMemberUser3ID,
      role_id: memberRoleID,
      user_id: organisationUserID,
    },
  })


  const org_member4 = await prisma.org_member.upsert({
    where: {
      id: orgMemberUser4ID,
    },
    update: {},
    create: {
      id: orgMemberUser4ID,
      organisation_id: organisationID,
      created_by: organisationUserID,
      type: 1,
    },
  })


  const org_member_roles4 = await prisma.org_member_roles.upsert({
    where: {
      id: orgMemberUser4ID,
    },
    update: {},
    create: {
      id: orgMemberUser4ID,
      role_id: memberRoleID,
      user_id: organisationUserID,
    },
  })
}

async function createDepartmentsAndAddUsers(prisma) {

  const hrDepartmenrOrgMember = await prisma.org_member.upsert({
    where: {
      id: hrDepartmentOrgMemberID,
    },
    update: {},
    create: {
      id: hrDepartmentOrgMemberID,
      organisation_id: organisationID,
      created_by: organisationUserID,
      type: 2,
    },
  })

  const operationsDepartmentOrgMemner = await prisma.org_member.upsert({
    where: {
      id: operationsDepartmentOrgMemberID,
    },
    update: {},
    create: {
      id: operationsDepartmentOrgMemberID,
      organisation_id: organisationID,
      created_by: organisationUserID,
      type: 2,
    },
  })

  const operationsDepartment = await prisma.department.upsert({
    where: {
      id: operationsDepartmentOrgMemberID,
    },
    update: {},
    create: {
      id: operationsDepartmentOrgMemberID,
      name: 'Operations',
      display_name: 'Operations',
    },
  })

  const hrDepartment = await prisma.department.upsert({
    where: {
      id: hrDepartmentOrgMemberID,
    },
    update: {},
    create: {
      id: hrDepartmentOrgMemberID,
      name: 'Human resource',
      display_name: 'Human resource',
    },
  })


  const departmentUser1 = await prisma.department_users.upsert({
    where: {
      id: departmentUser1ID,
    },
    update: {},
    create: {
      id: departmentUser1ID,
      org_member_id:orgMemberUser1ID,
      department_id:hrDepartmentOrgMemberID,
     
    },
  })

  const departmentUser2 = await prisma.department_users.upsert({
    where: {
      id: departmentUser2ID,
    },
    update: {},
    create: {
      id: departmentUser2ID,
      org_member_id:orgMemberUser2ID,
      department_id:hrDepartmentOrgMemberID,
     
    },
  })
  const departmentUser3 = await prisma.department_users.upsert({
    where: {
      id: departmentUser3ID,
    },
    update: {},
    create: {
      id: departmentUser3ID,
      org_member_id:orgMemberUser3ID,
      department_id:operationsDepartmentOrgMemberID,
     
    },
  })
  const departmentUser4 = await prisma.department_users.upsert({
    where: {
      id: departmentUser4ID,
    },
    update: {},
    create: {
      id: departmentUser4ID,
      org_member_id:orgMemberUser4ID,
      department_id:operationsDepartmentOrgMemberID,
     
    },
  })
}

export { createUser, createPredefinedRoles,createMemberUsers,inviteMemberUsersToOrganisation,createDepartmentsAndAddUsers }
