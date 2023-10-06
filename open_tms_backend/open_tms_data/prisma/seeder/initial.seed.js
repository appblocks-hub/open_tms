import { hash, genSalt } from 'bcrypt';

// const ORGANISATION = 1;
const SUPERADMIN = 1;
const BANK = 2;
// const USER = 2;

async function superAdmin(prisma) {
  const tenant = await prisma.tenant.create({
    data: {
      name: 'Appblocks',
      display_name: 'Appblocks',
    },
  });

 const user= await prisma.user.createMany({
    data: [
      {
        id: 'cf05c6f8-ad2d-4696-a354-34757901c72c',
        first_name :"Appblocks",
        middle_name :"",
        last_name:"Admin",
        country_code:"+91",
        phn_no:"",
        display_name:"Appblocks Admin"
      },
      // {
      //   id: '06baffa8-2b8f-4214-b4d2-8f5275518ab9',
      //   name: 'C4C',
      //   display_name: 'Cash 4 Construction',
      //   type: USER,
      //   tenant_id: tenant.id,
      // },
    ],
  });

  const member = await prisma.member.findMany({
    where: { tenant_id: tenant.id },
  });

  const organisation = await prisma.organisation.create({
    data: {
      id: member[0].id,
      name: 'C4C',
      display_name: 'Cash 4 Construction',
      created_by: member.id,
    },
  });

  await prisma.user_organisation.create({
    data: {
      user_id: member[1].id,
      organisation_id: organisation.id,
    },
  });

  await prisma.roles.create({
    data: {
      name: 'admin',
      display_name: 'Admin',
      member_id: member[1].id,
    },
  });

  await prisma.organisation_type.createMany({
    data: [
      {
        type: SUPERADMIN,
        created_by: member[1].id,
        organisation_id: organisation.id,
      },
      {
        type: BANK,
        created_by: member[1].id,
        organisation_id: organisation.id,
      },
    ],
  });

  // const user = await prisma.user.create({
  //   data: {
  //     id: member[1].id,
  //     first_name: 'C4C',
  //     country_code: '',
  //     phn_no: '8019195842',
  //     display_name: 'Cash 4 Construction',
  //   },
  // });

  await prisma.user_email.create({
    data: {
      email: 'jira.cash4construction@gmail.com',
      user_id: user.id,
      email_type: 1,
    },
  });

  const salt = await genSalt(10);
  const password = await hash('C4cadmin@01', 10);

  await prisma.user_authentication_info.create({
    data: {
      id: user.id,
      password_hash: password,
      password_salt: salt,
    },
  });

  await prisma.funding_source.createMany({
    data: [
      {
        type: 'check',
        member_id: member[1].id,
      },
      {
        type: 'overnight',
        member_id: member[1].id,
      },
    ],
  });

  await prisma.address.createMany({
    data: [
      {
        name: 'Cash 4 Construction',
        line1: '493 West',
        line2: '30 North',
        state_or_province: 'Utah',
        city: 'American Fork',
        postal_code: '84003',
        created_by: user.id,
        member_id: user.id,
        address_type_code: 0,
        is_primary: true,
      },
      {
        name: 'Cash 4 Construction',
        line1: '493 West',
        line2: '30 North',
        state_or_province: 'Utah',
        city: 'American Fork',
        postal_code: '84003',
        created_by: user.id,
        member_id: user.id,
        address_type_code: 2,
        is_primary: true,
      },
    ],
  });
}

export default superAdmin;
