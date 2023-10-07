import { hash, genSalt } from 'bcrypt';

// const ORGANISATION = 1;
const SUPERADMIN = 1;
const BANK = 2;
// const USER = 2;

async function createUser(prisma) {
  const tenant =await prisma.tenant.upsert({
    where: {
      name: 'Appblocks',
    },
    update: {},
    create: {
      data: {
        name: 'Appblocks',
        display_name: 'Appblocks',
      },
    }
  })
  
  
  await prisma.tenant.create();

  console.log("tenant is \n",tenant)

 const user= await prisma.user.create({
    data: 
      {
        first_name :"Appblocks",
        middle_name :"",
        last_name:"Admin",
        country_code:"+91",
        phn_no:"",
        display_name:"Appblocks Admin"
      }
  });

  console.log("user is \n",user)

  await prisma.user_email.create({
    data: {
      email: 'appblocksAdmin@mailinator.com',
      user_id: user.id,
      email_type: 0,
    },
  });

  const salt = await genSalt(10);
  const password = await hash('Admin@01', 10);

  await prisma.user_authentication_info.create({
    data: {
      user_id: user.id,
      password_hash: password,
      password_salt: salt,
    },
  });

  const organisation=await prisma.organisation.create({
    data: {
      tenant_id:tenant.id,
      name:user.first_name,
      display_name:user.first_name,
      created_by:user.id,
      // password_hash: password,
      // password_salt: salt,
    },
  });

  console.log("organisation is \n",organisation)

  const org_member=await prisma.org_member.create({
    data: {
      organisation_id:organisation.id,
      name:user.first_name,
      display_name:user.first_name,
      created_by:user.id,
      type:1,
    },
  });

  console.log("org member is \n",org_member)

  const roleAssignee=await prisma.roles.findFirst({
    where: {
      name:"role-assignee" 
    },
  })

  const org_member_roles=await prisma.org_member_roles.create({
    data: {
      id:org_member.id,
      role_id:roleAssignee.id,
      user_id:user.id,
    },
  });

}


async function createPredefinedRoles(prisma) {


 const roles= await prisma.roles.createMany({
    data: [
      {
        name:"role-assignee",
        display_name:"role-assignee"
      },
    ],
  });
  
  console.log("roles are \n",roles)


}

export  {createUser,createPredefinedRoles};
