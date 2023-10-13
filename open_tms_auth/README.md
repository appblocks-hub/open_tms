<p align="right">
  <a href="https://appblocks.com" target="_blank">
    <img alt="appblocks-logo" height="70" alt="Appblocks Logo" src=""/>
  </a>
</p>

# Introduction

This package block, generated with Appblocks, provides authentication functionalities such as email OTP verification for sign up, login, and password recovery.

# Getting Started

## Step 1: Configuration

To configure the package, you can use environment variables. These variables can be set in the `.env.functions` file located in the base directory of this package. Below is a table of the default variables that can be used:

| Variable                               | Description                                | Value                                                                          |
| -------------------------------------- | ------------------------------------------ | ------------------------------------------------------------------------------ |
| BB_OPEN_TMS_SECRET_KEY                 | The string used for hashing                | [random-string]                                                                |
| BB_OPEN_TMS_REFRESH_KEY                | The string used for hashing tokens         | [random-string]                                                                |
| BB_OPEN_TMS_MAILER_EMAIL               | Node mailer email                          | [email-value]                                                                  |
| BB_OPEN_TMS_MAILER_PASSWORD            | Node mailer password                       | [password-value]                                                               |
| BB_OPEN_TMS_MAILER_HOST                | Node mailer host url                       | [url-value]                                                                    |
| BB_OPEN_TMS_MAILER_PORT                | Node mailer port                           | [port-value]                                                                   |
| BB_OPEN_TMS_MAILER_NAME                | Node mailer name                           | [name-value]                                                                   |
| BB_OPEN_TMS_DATABASE_URL               | Connection URL for the PostgreSQL database | postgresql://[username]:[password]@localhost:[db-port]/[db-name]?schema=public |
| BB_OPEN_TMS_REDIS_HOST                 | Host name for the Redis database           | [host-value]                                                                   |
| BB_OPEN_TMS_REDIS_PORT                 | Port number for the Redis database         | [port-value]                                                                   |
| BB_OPEN_TMS_REFRESH_TOKEN_EXPIRY       | Secret used to sign the JSON Web Token     | [expiry-value]                                                                 |
| BB_OPEN_TMS_ACCESS_TOKEN_EXPIRY        | Expiration time for the JSON Web Token     | [expiry-value]                                                                 |
| BB_OPEN_TMS_OTP_EXPIRY_TIME_IN_SECONDS | OTP Expiry time in seconds                 | [time-value]                                                                   |
| BB_OPEN_TMS_LOGO_URL                   | Logo url                                   | [url-value]                                                                    |

## Step 2.1: Scripts - Prerequisites

Before running the package, make sure the following prerequisites are met:

- Node.js [^16.x] is installed
- Prisma is installed globally
- Redis is installed
- PostgreSQL is installed

## Step 2.2: Scripts - Database Migration

After setting up the prerequisites, run the database migration script:

```sh
# Navigate to the Prisma directory
$ cd /open_ab_be_shared_auth/prisma
```

> **Note**
> Export DB url or keep an env in prisma folder since prisma cli commands won't be able to access appblocks `.env.function`.

```sh
# Export BB_OPEN_AB_AUTH_BB_DATABASE_URL
$ export BB_OPEN_AB_AUTH_BB_DATABASE_URL=postgresql://[username]:[password]@localhost:[db-port]/[db-name]?schema=public
```

```sh
# Migrate the Prisma client
$ prisma migrate dev --name init
```

```sh
# Seed the database
$ prisma db seed
```

## Step 2.3: Scripts - Starting the Package

After the migration, navigate to the root folder of the package:

```sh
# Start the package
$ bb start
```

### open_tms_auth_fe_container

### open_tms_auth_fe_login_layout

### auth_be_shared

### open_tms_auth_fe_login

### open_tms_auth_fe_forgot_password

### open_tms_auth_fe_verify_email

### open_tms_auth_fe_reset_password

### open_tms_auth_fe_signup

### open_tms_auth_fe_verify_otp

### open_tms_auth_be_login

### open_tms_auth_be_reset_password

### open_tms_auth_be_verify_email

### open_tms_auth_be_signup

### open_tms_auth_be_send_otp_for_verification

### open_tms_auth_be_verify_otp

### open_tms_auth_be_forgot_password
