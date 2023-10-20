import { hash, genSalt } from 'bcrypt'

const tenantID = '71df8bec-075a-48a0-9ea7-6d5f85de729c'
const organisationUserID = 'd68fae1a-9da6-4f62-b700-97fb2c73502d'

const userAccountID = 'da382b30-1a49-4ab4-89c5-033b39288d96'

const userAuthenticationInfoID = '4ab2a9d6-789c-4d97-9fb9-162fa226f649'

const organisationID = '090c4951-217d-4513-b016-49ed085d24d1'

const orgMemberID = '205d80a2-e8ed-4061-b09b-e0d1e9c11133'

const assigneeRoleID = '82f68fb9-c53a-4a05-a94a-2213a7ac72c2'

const memberRoleID = 'ab6c41b5-1e05-4c5c-9bcf-ffda4f5d4ea6'

const operationsDepartmentID = '7b2870ab-1324-4a42-abf3-d8a7b6b5020e'

const hRDepartmentID = '979bc3e2-a2f5-431a-8080-e36952c9b95d'

const hrDepartmentOrgMemberID = '0cc0354e-152a-4dcf-ae91-25a761598bbe'

const operationsDepartmentOrgMemberID = '2e6b588f-2cb8-4bb6-a0c8-414651ab9b62'

const memberUser1ID = 'ac7b018f-ec8f-448e-a50a-b0a47fb678d4'

const orgMemberUser1ID = '940c365b-b75b-4fc9-a0c4-c0e6c8496539'

const orgMemberRolesUser1ID = '74049637-630e-46b0-8f8b-1f0cc754fb93'

const memberUser1AccountID = 'e614be04-6f81-446c-84d1-8dae439d80c6'

const departmentUser1ID = 'a50ea42f-ba55-4c18-813a-0492b59863e2'

const memberUser2ID = 'e906b6f6-f609-40d9-b2e0-c263d541669b'

const orgMemberUser2ID = 'bc038273-e433-45f7-953a-605fcc95bb27'

const orgMemberRolesUser2ID = '74d1ab12-e32b-4168-87d5-91644b3b0ce6'

const departmentUser2ID = '9816aa00-13ea-4ece-9893-a408599bb8f0'

const memberUser2AccountID = '6f97e82a-e114-478b-a5d4-498f5af5ec53'

const memberUser3ID = '6e7ddb72-3dba-4d1a-99fe-5a09d2914c6e'

const orgMemberUser3ID = 'c5ac3afd-8d9c-43a4-b6e2-eebec755151b'

const orgMemberRolesUser3ID = '07f264b0-7e24-4967-8b4a-5a2a5bff82ef'

const departmentUser3ID = '865dfd85-ab3c-493b-8aea-2a194df9b7f1'

const memberUser3AccountID = '7908a9ac-1fa2-432c-a6f8-1aa58a52b80b'

const memberUser4ID = '3ac14aca-0e57-4506-90fe-6b476d81117a'

const orgMemberUser4ID = '1a4cc4a7-305b-41a6-bcef-fe15bec56a41'

const orgMemberRolesUser4ID = 'ea0dd9c3-4c4e-430d-a028-e47ff9685946'

const departmentUser4ID = '2de50fb1-1e12-4064-9f9b-72b9d8c6b27a'

const memberUser4AccountID = '39336571-3643-48ac-a9ff-6ae360e2efbe'

const process1ID = '2de50fb1-1e12-4064-9f9b-72b9d8c6b27a'

const ticketRaisedStageID = 'b6de2027-250c-4757-b8a7-8a4f97a7ff5b'
const ticketApprovedStageID = '6e7c1432-70fe-4fd4-b8bd-17e28efc2790'

const ticketRejectedStageID = 'e72c75e7-90ac-49e5-b22f-fcab083d72ca'
const ticketReassignedStageID = '93349716-ac09-4dbe-8c0b-f48565012003'

const ticketResolvedStageID = '234b03a1-cac9-4d76-80a3-e4c79e2696ca'

const ticketRevisedStageID = '36b509da-5f49-4783-9373-f5e970467855'

const ticketClosedStageID = '8be8ab00-d924-4be4-98ea-d126f7eccd7f'

const processPath1ID = '911c27a0-0922-4242-a04a-cdbc424534ab'
const processPath2ID = 'f5a9ca6e-6497-46c7-b200-927dbe6b232f'
const processPath3ID = '3891ceaf-1653-4577-af3e-5bb513d55cea'
const processPath4ID = 'da4182dd-dd7e-44ec-bda6-8ac1533c951a'
const processPath5ID = '795a92d8-2c2a-4fc4-8d4d-aba2ce6f5e32'
const processPath6ID = '0075c5ee-667f-419c-8899-d929000368f8'
const processPath7ID = '4adaf403-5005-46f3-a91e-bc390c4858a7'
const processPath8ID = 'e4050c51-3f5f-42e9-ac06-63912c9fc441'
const processPath9ID = '40aa3d4c-d919-48b2-9517-6e1ca9ca890c'
const processPath10ID = '15aebfe9-20d5-4b32-85b4-f5a7dca94d6c'
const processPath11ID = '1e507140-0bd9-4668-a2b9-ef7e73cc5738'
const processPath12ID = 'fcc42a4e-799c-458b-9f99-f94ce69e729e'
const processPath13ID = '46dc95d5-9ee7-46fa-9ac6-9139118591ff'
const processPath14ID = 'd6f518e8-0ab1-41e4-98ce-386129480c0a'
const processPath15ID = 'b4225184-f791-4449-aa44-5d91a28ec887'
const sampleTicket1ID = 'f55c4d93-6162-4970-aa68-ca2989bc418a'
const sampleTicket2ID = '9fc38479-1619-48d1-8aa6-996cff08a5bb'

const t1Revision1ID = '93766add-d677-4328-89da-89c1be1d05e8'

const t1Revision2ID = 'd52164e8-e5cc-4a5a-b8aa-9e52d4402473'

const t1Activity1ID = 'dea799d2-25fa-4745-934a-6f6ce150119c'
const t1Activity2ID = 'b02c9151-a356-4b0a-94ad-d7b56ec966cc'
const t1Activity3ID = '91c6fe16-fb8b-4b79-a853-f0ef6a026255'
const t1Activity4ID = 'eafd14f3-9804-40a0-b468-94ec5898b26a'
const t1Activity5ID = '8bdd8aae-d321-41a9-9c7b-a7244d742042'

const t2Revision1ID = '460928d0-3ece-4cf6-bd11-2a33ef2ad789'
const t2Revision2ID = '5be59677-62c1-474f-ac95-5e7e40309ba5'
const t2Revision3ID = 'e9ce3c01-0e49-4fb7-9a80-c3c43e9ad81c'

const t2Activity1ID = '828cb639-9592-40f9-ad8d-90b27570ff47'
const t2Activity2ID = '2fe8b510-eb5f-4a03-8473-29a99b012e2a'
const t2Activity3ID = 'bc8f0672-8c05-4ac9-a4d7-80b54a8d5e0a'
const t2Activity4ID = 'cd6cc94f-1bd1-46e1-828c-d1715fc75cb0'
const t2Activity5ID = '99c5df8d-3b22-44ff-bee1-e4cb124e4515'
const t2Activity6ID = '04a3cf74-98bb-454d-9d5a-d57d93224172'
const t2Activity7ID = '8111c92b-405b-437b-8b32-9dfa012c285d'

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

  const salt = await genSalt()
  const password = await hash('Password@97', 10)

  await prisma.user_account.upsert({
    where: {
      id: userAccountID,
    },
    update: {},
    create: {
      id: userAccountID,
      user_id: user.id,
      password_hash: password,
      password_salt: salt,
      provider: 'password',
      email: 'appblocksadmin@mailinator.com',
      is_email_verified: true,
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

  const salt = await genSalt()
  const mR1password = await hash('Password@97', 10)

  await prisma.user_account.upsert({
    where: {
      id: memberUser1AccountID,
    },
    update: {},
    create: {
      id: memberUser1AccountID,
      user_id: memberUser1ID,
      password_hash: mR1password,
      password_salt: salt,
      provider: 'password',
      email: 'memberUser1@mailinator.com',
      is_email_verified: true,
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

  const mR2Password = await hash('Password@97', 10)

  await prisma.user_account.upsert({
    where: {
      id: memberUser2AccountID,
    },
    update: {},
    create: {
      id: memberUser2AccountID,
      user_id: memberUser2ID,
      password_hash: mR2Password,
      password_salt: salt,
      provider: 'password',
      email: 'memberUser2@mailinator.com',
      is_email_verified: true,
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

  const mR3password = await hash('Password@97', 10)

  await prisma.user_account.upsert({
    where: {
      id: memberUser3AccountID,
    },
    update: {},
    create: {
      id: memberUser3AccountID,
      user_id: memberUser3ID,
      password_hash: mR3password,
      password_salt: salt,
      provider: 'password',
      email: 'memberUser3@mailinator.com',
      is_email_verified: true,
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

  const mR4Password = await hash('Password@97', 10)

  await prisma.user_account.upsert({
    where: {
      id: memberUser4AccountID,
    },
    update: {},
    create: {
      id: memberUser4AccountID,
      user_id: memberUser4ID,
      password_hash: mR4Password,
      password_salt: salt,
      provider: 'password',
      email: 'memberUser4@mailinator.com',
      is_email_verified: true,
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
      user_id: memberUser1ID,
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
      user_id: memberUser2ID,
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
      user_id: memberUser3ID,
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
      user_id: memberUser4ID,
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
      role_id: assigneeRoleID,
      org_member_id: orgMemberUser1ID,
      department_id: hrDepartmentOrgMemberID,
    },
  })

  const departmentUser2 = await prisma.department_users.upsert({
    where: {
      id: departmentUser2ID,
    },
    update: {},
    create: {
      id: departmentUser2ID,
      role_id: memberRoleID,
      org_member_id: orgMemberUser2ID,
      department_id: hrDepartmentOrgMemberID,
    },
  })
  const departmentUser3 = await prisma.department_users.upsert({
    where: {
      id: departmentUser3ID,
    },
    update: {},
    create: {
      id: departmentUser3ID,
      role_id: memberRoleID,
      org_member_id: orgMemberUser3ID,
      department_id: operationsDepartmentOrgMemberID,
    },
  })
  const departmentUser4 = await prisma.department_users.upsert({
    where: {
      id: departmentUser4ID,
    },
    update: {},
    create: {
      id: departmentUser4ID,
      role_id: memberRoleID,
      org_member_id: orgMemberUser4ID,
      department_id: operationsDepartmentOrgMemberID,
    },
  })
}

async function createProcess(prisma) {
  const generalticketProcess = await prisma.process.upsert({
    where: {
      id: process1ID,
    },
    update: {},
    create: {
      id: process1ID,
      name: 'general_ticket_management_flow',
      organisation_id: organisationID,
      created_by: organisationUserID,
      display_name: 'General Ticket Management Flow',
    },
  })

  const ticketRaisedStage = await prisma.stage.upsert({
    where: {
      id: ticketRaisedStageID,
    },
    update: {},
    create: {
      id: ticketRaisedStageID,
      process_id: process1ID,
      name: 'ticket_raised',
      display_name: 'Ticket Raised',
      created_by: organisationUserID,
      is_start: true,
    },
  })

  const ticketApprovedStage = await prisma.stage.upsert({
    where: {
      id: ticketApprovedStageID,
    },
    update: {},
    create: {
      id: ticketApprovedStageID,
      process_id: process1ID,
      name: 'ticket_approved',
      display_name: 'Ticket Approved',
      created_by: organisationUserID,
    },
  })

  const ticketRejectedStage = await prisma.stage.upsert({
    where: {
      id: ticketRejectedStageID,
    },
    update: {},
    create: {
      id: ticketRejectedStageID,
      process_id: process1ID,
      name: 'ticket_rejected',
      display_name: 'Ticket Rejected',
      created_by: organisationUserID,
    },
  })

  const ticketReassignedStage = await prisma.stage.upsert({
    where: {
      id: ticketReassignedStageID,
    },
    update: {},
    create: {
      id: ticketReassignedStageID,
      process_id: process1ID,
      name: 'ticket_reassigned',
      display_name: 'Ticket Reassigned',
      created_by: organisationUserID,
    },
  })

  const ticketResolvedStage = await prisma.stage.upsert({
    where: {
      id: ticketResolvedStageID,
    },
    update: {},
    create: {
      id: ticketResolvedStageID,
      process_id: process1ID,
      name: 'ticket_resolved',
      display_name: 'Ticket Resolved',
      created_by: organisationUserID,
    },
  })

  const ticketRevisedStage = await prisma.stage.upsert({
    where: {
      id: ticketRevisedStageID,
    },
    update: {},
    create: {
      id: ticketRevisedStageID,
      process_id: process1ID,
      name: 'ticket_revised',
      display_name: 'Ticket Revised',
      created_by: organisationUserID,
    },
  })
  const ticketClosedStage = await prisma.stage.upsert({
    where: {
      id: ticketClosedStageID,
    },
    update: {},
    create: {
      id: ticketClosedStageID,
      process_id: process1ID,
      name: 'ticket_closed',
      display_name: 'Ticket Closed',
      created_by: organisationUserID,
      is_end: true,
    },
  })

  const processPath1 = await prisma.process_path.upsert({
    where: {
      id: processPath1ID,
    },
    update: {},
    create: {
      id: processPath1ID,
      process_id: process1ID,
      name: 'ticket_raised_to_ticket_rejected',
      display_name: 'Ticket Raised to Ticket Rejected',
      created_by: organisationUserID,
      from_stage: ticketRaisedStageID,
      to_stage: ticketRejectedStageID,
    },
  })

  const processPath2 = await prisma.process_path.upsert({
    where: {
      id: processPath2ID,
    },
    update: {},
    create: {
      id: processPath2ID,
      process_id: process1ID,
      name: 'ticket_raised_to_ticket_resolved',
      display_name: 'Ticket Raised to Ticket Resolved',
      created_by: organisationUserID,
      from_stage: ticketRaisedStageID,
      to_stage: ticketResolvedStageID,
    },
  })

  const processPath3 = await prisma.process_path.upsert({
    where: {
      id: processPath3ID,
    },
    update: {},
    create: {
      id: processPath3ID,
      process_id: process1ID,
      name: 'ticket_raised_to_ticket_reassigned',
      display_name: 'Ticket Raised to Ticket Reassinged',
      created_by: organisationUserID,
      from_stage: ticketRaisedStageID,
      to_stage: ticketReassignedStageID,
    },
  })

  const processPath4 = await prisma.process_path.upsert({
    where: {
      id: processPath4ID,
    },
    update: {},
    create: {
      id: processPath4ID,
      process_id: process1ID,
      name: 'ticket_raised_to_ticket_revised',
      display_name: 'Ticket Raised to Ticket Revised',
      created_by: organisationUserID,
      from_stage: ticketRaisedStageID,
      to_stage: ticketRevisedStageID,
    },
  })

  const processPath5 = await prisma.process_path.upsert({
    where: {
      id: processPath5ID,
    },
    update: {},
    create: {
      id: processPath5ID,
      process_id: process1ID,
      name: 'ticket_rejected_to_ticket_closed',
      display_name: 'Ticket Rejected to Ticket Closed',
      created_by: organisationUserID,
      from_stage: ticketRejectedStageID,
      to_stage: ticketClosedStageID,
    },
  })

  const processPath6 = await prisma.process_path.upsert({
    where: {
      id: processPath6ID,
    },
    update: {},
    create: {
      id: processPath6ID,
      process_id: process1ID,
      name: 'ticket_rejected_to_ticket_revised',
      display_name: 'Ticket Rejected to Ticket Revised',
      created_by: organisationUserID,
      from_stage: ticketRejectedStageID,
      to_stage: ticketRevisedStageID,
    },
  })

  const processPath7 = await prisma.process_path.upsert({
    where: {
      id: processPath7ID,
    },
    update: {},
    create: {
      id: processPath7ID,
      process_id: process1ID,
      name: 'ticket_reassigned_to_ticket_reassinged',
      display_name: 'Ticket Reassigned to Ticket Reassigned',
      created_by: organisationUserID,
      from_stage: ticketReassignedStageID,
      to_stage: ticketReassignedStageID,
    },
  })

  const processPath8 = await prisma.process_path.upsert({
    where: {
      id: processPath8ID,
    },
    update: {},
    create: {
      id: processPath8ID,
      process_id: process1ID,
      name: 'ticket_reassigned_to_ticket_rejected',
      display_name: 'Ticket Reassigned to Ticket Rejected',
      created_by: organisationUserID,
      from_stage: ticketReassignedStageID,
      to_stage: ticketRejectedStageID,
    },
  })

  const processPath9 = await prisma.process_path.upsert({
    where: {
      id: processPath9ID,
    },
    update: {},
    create: {
      id: processPath9ID,
      process_id: process1ID,
      name: 'ticket_reassigned_to_ticket_resolved',
      display_name: 'Ticket Reassigned to Ticket Resolved',
      created_by: organisationUserID,
      from_stage: ticketReassignedStageID,
      to_stage: ticketResolvedStageID,
    },
  })

  const processPath10 = await prisma.process_path.upsert({
    where: {
      id: processPath10ID,
    },
    update: {},
    create: {
      id: processPath10ID,
      process_id: process1ID,
      name: 'ticket_reassigned_to_ticket_revised',
      display_name: 'Ticket Reassigned to Ticket Revised',
      created_by: organisationUserID,
      from_stage: ticketReassignedStageID,
      to_stage: ticketRevisedStageID,
    },
  })

  const processPath11 = await prisma.process_path.upsert({
    where: {
      id: processPath11ID,
    },
    update: {},
    create: {
      id: processPath11ID,
      process_id: process1ID,
      name: 'ticket_resolved_to_ticket_closed',
      display_name: 'Ticket Resolved to Ticket Closed',
      created_by: organisationUserID,
      from_stage: ticketResolvedStageID,
      to_stage: ticketClosedStageID,
    },
  })

  const processPath12 = await prisma.process_path.upsert({
    where: {
      id: processPath12ID,
    },
    update: {},
    create: {
      id: processPath12ID,
      process_id: process1ID,
      name: 'ticket_revised_to_ticket_rejected',
      display_name: 'Ticket Revised to Ticket Rejected',
      created_by: organisationUserID,
      from_stage: ticketRevisedStageID,
      to_stage: ticketRejectedStageID,
    },
  })

  const processPath13 = await prisma.process_path.upsert({
    where: {
      id: processPath13ID,
    },
    update: {},
    create: {
      id: processPath13ID,
      process_id: process1ID,
      name: 'ticket_revised_to_ticket_resolved',
      display_name: 'Ticket Revised to Ticket Resolved',
      created_by: organisationUserID,
      from_stage: ticketRevisedStageID,
      to_stage: ticketResolvedStageID,
    },
  })

  const processPath14 = await prisma.process_path.upsert({
    where: {
      id: processPath14ID,
    },
    update: {},
    create: {
      id: processPath14ID,
      process_id: process1ID,
      name: 'ticket_revised_to_ticket_reassigned',
      display_name: 'Ticket Revised to Ticket Reassigned',
      created_by: organisationUserID,
      from_stage: ticketRevisedStageID,
      to_stage: ticketReassignedStageID,
    },
  })

  const processPath15 = await prisma.process_path.upsert({
    where: {
      id: processPath15ID,
    },
    update: {},
    create: {
      id: processPath15ID,
      process_id: process1ID,
      name: 'ticket_revised_to_ticket_revised',
      display_name: 'Ticket Revised to Ticket Revised',
      created_by: organisationUserID,
      from_stage: ticketRevisedStageID,
      to_stage: ticketRevisedStageID,
    },
  })
}

async function createTicket(prisma) {
  const sampleTicket1 = await prisma.ticket.upsert({
    where: {
      id: sampleTicket1ID,
    },
    update: {},
    create: {
      id: sampleTicket1ID,
      status: 0,
      organisation_id: organisationID,
      created_by: memberUser1ID,
    },
  })

  const sampleTicket2 = await prisma.ticket.upsert({
    where: {
      id: sampleTicket2ID,
    },
    update: {},
    create: {
      id: sampleTicket2ID,
      status: 0,
      organisation_id: organisationID,
      created_by: memberUser2ID,
    },
  })

  const t1Revision1 = await prisma.ticket_revision.upsert({
    where: {
      id: t1Revision1ID,
    },
    update: {},
    create: {
      id: t1Revision1ID,
      title: 'Sample Ticket 1 Revision 1',
      description: 'Sample Ticket 1 Description1',
      process_id: process1ID,
      created_by: memberUser1ID,
      ticket_id: sampleTicket1ID,
    },
  })

  const t1Activity1 = await prisma.ticket_activity.upsert({
    where: {
      id: t1Activity1ID,
    },
    update: {},
    create: {
      id: t1Activity1ID,
      ticket_revision_id: t1Revision1ID,
      created_by: memberUser1ID,
      current_stage: ticketRaisedStageID,
      assignee_id: operationsDepartmentOrgMemberID,
    },
  })

  const t2Revision1 = await prisma.ticket_revision.upsert({
    where: {
      id: t2Revision1ID,
    },
    update: {},
    create: {
      id: t2Revision1ID,
      title: 'Sample Ticket 2 Revision 1',
      description: 'Sample Ticket 2 Description1',
      process_id: process1ID,
      created_by: memberUser2ID,
      ticket_id: sampleTicket2ID,
    },
  })

  const t2Activity1 = await prisma.ticket_activity.upsert({
    where: {
      id: t2Activity1ID,
    },
    update: {},
    create: {
      id: t2Activity1ID,
      ticket_revision_id: t2Revision1ID,
      created_by: memberUser1ID,
      current_stage: ticketRaisedStageID,
      assignee_id: orgMemberUser2ID,
    },
  })
}

async function updateTicket(prisma) {
  const t1Activity2 = await prisma.ticket_activity.upsert({
    where: {
      id: t1Activity2ID,
    },
    update: {},
    create: {
      id: t1Activity2ID,
      ticket_revision_id: t1Revision1ID,
      created_by: memberUser1ID,
      current_stage: ticketRejectedStageID,
      assignee_id: operationsDepartmentOrgMemberID,
      remark: 'Ticket Rejection1',
    },
  })

  const t1Revision2 = await prisma.ticket_revision.upsert({
    where: {
      id: t1Revision2ID,
    },
    update: {},
    create: {
      id: t1Revision2ID,
      title: 'Sample Ticket 1 Revision 2',
      description: 'Sample Ticket 1 Description2',
      process_id: process1ID,
      created_by: memberUser1ID,
      ticket_id: sampleTicket1ID,
    },
  })

  const t1Activity3 = await prisma.ticket_activity.upsert({
    where: {
      id: t1Activity3ID,
    },
    update: {},
    create: {
      id: t1Activity3ID,
      ticket_revision_id: t1Revision2ID,
      created_by: memberUser1ID,
      current_stage: ticketRevisedStageID,
      assignee_id: operationsDepartmentOrgMemberID,
    },
  })

  const t1Activity4 = await prisma.ticket_activity.upsert({
    where: {
      id: t1Activity4ID,
    },
    update: {},
    create: {
      id: t1Activity4ID,
      ticket_revision_id: t1Revision2ID,
      created_by: memberUser1ID,
      current_stage: ticketResolvedStageID,
      assignee_id: operationsDepartmentOrgMemberID,
    },
  })

  const t1Activity5 = await prisma.ticket_activity.upsert({
    where: {
      id: t1Activity5ID,
    },
    update: {},
    create: {
      id: t1Activity5ID,
      ticket_revision_id: t1Revision2ID,
      created_by: memberUser1ID,
      current_stage: ticketClosedStageID,
      assignee_id: operationsDepartmentOrgMemberID,
    },
  })

  const t2Activity2 = await prisma.ticket_activity.upsert({
    where: {
      id: t2Activity2ID,
    },
    update: {},
    create: {
      id: t2Activity2ID,
      ticket_revision_id: t2Revision1ID,
      created_by: memberUser1ID,
      current_stage: ticketReassignedStageID,
      assignee_id: orgMemberUser3ID,
    },
  })

  const t2Revision2 = await prisma.ticket_revision.upsert({
    where: {
      id: t2Revision2ID,
    },
    update: {},
    create: {
      id: t2Revision2ID,
      title: 'Sample Ticket 2 Revision 2',
      description: 'Sample Ticket 2 Description2',
      process_id: process1ID,
      created_by: organisationUserID,
      ticket_id: sampleTicket2ID,
    },
  })

  const t2Activity3 = await prisma.ticket_activity.upsert({
    where: {
      id: t2Activity3ID,
    },
    update: {},
    create: {
      id: t2Activity3ID,
      ticket_revision_id: t2Revision2ID,
      created_by: memberUser1ID,
      current_stage: ticketRevisedStageID,
      assignee_id: orgMemberUser3ID,
    },
  })

  const t2Activity4 = await prisma.ticket_activity.upsert({
    where: {
      id: t2Activity4ID,
    },
    update: {},
    create: {
      id: t2Activity4ID,
      ticket_revision_id: t2Revision2ID,
      created_by: memberUser1ID,
      current_stage: ticketReassignedStageID,
      assignee_id: orgMemberUser4ID,
    },
  })

  const t2Revision3 = await prisma.ticket_revision.upsert({
    where: {
      id: t2Revision3ID,
    },
    update: {},
    create: {
      id: t2Revision3ID,
      title: 'Sample Ticket 2 Revision 3',
      description: 'Sample Ticket 2 Description3',
      process_id: process1ID,
      created_by: memberUser3ID,
      ticket_id: sampleTicket2ID,
    },
  })

  const t2Activity5 = await prisma.ticket_activity.upsert({
    where: {
      id: t2Activity5ID,
    },
    update: {},
    create: {
      id: t2Activity5ID,
      ticket_revision_id: t2Revision3ID,
      created_by: memberUser1ID,
      current_stage: ticketRevisedStageID,
      assignee_id: orgMemberUser4ID,
    },
  })

  const t2Activity6 = await prisma.ticket_activity.upsert({
    where: {
      id: t2Activity6ID,
    },
    update: {},
    create: {
      id: t2Activity6ID,
      ticket_revision_id: t2Revision3ID,
      created_by: memberUser1ID,
      current_stage: ticketResolvedStageID,
      assignee_id: orgMemberUser4ID,
    },
  })

  const t2Activity7 = await prisma.ticket_activity.upsert({
    where: {
      id: t2Activity7ID,
    },
    update: {},
    create: {
      id: t2Activity7ID,
      ticket_revision_id: t2Revision3ID,
      created_by: memberUser1ID,
      current_stage: ticketClosedStageID,
      assignee_id: orgMemberUser4ID,
    },
  })
}

export {
  createUser,
  createPredefinedRoles,
  createMemberUsers,
  inviteMemberUsersToOrganisation,
  createDepartmentsAndAddUsers,
  createProcess,
  createTicket,
  updateTicket,
}
