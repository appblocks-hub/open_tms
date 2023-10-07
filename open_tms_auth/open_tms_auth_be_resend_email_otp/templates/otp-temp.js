const otpTemp = `
<!DOCTYPE html>
<html>

<head>
  <meta charset="utf-8" />
  <meta http-equiv="x-ua-compatible" content="ie=edge" />
  <title>auth otp email template</title>
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <style type="text/css">
    /**
   * Google webfonts. Recommended to include the .woff version for cross-client compatibility.
   */
    @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap');

    p{
      margin: 0;
    }

  </style>
</head>

<body>

  <!-- start body -->
  <table border="0" cellpadding="0" cellspacing="0" width="100%">

    <!-- start copy block -->
    <tr>
      <td align="center" style="padding: 0px 15px;">
        <table border="0" cellpadding="0" cellspacing="0" style="max-width: 600px;font-family: 'Inter', sans-serif;">
          <!-- Logo Starts -->
          <tr>
            <td align="center" style="padding: 24px; background-color:#1B1B1B;">
                <img src={{logo}} alt="Logo" border="0" width=""/>
            </td>
          </tr>
         <!-- logo ends -->

         <!-- header content Starts -->
         <tr>
          <td align="left" bgcolor="#ffffff" style="
                
                background-color: #ffffff;
                padding: 45px 43px 34px 43px;
              ">
               <p style="font-size: 17px; font-weight: 600; line-height: 20px; color: #252C32; padding-bottom: 27px; margin: 0px;">Hi {{user}},</p>
              <p style=" font-size: 17px; font-weight: 500; line-height: 23px; color:#010101; margin: 0px;">We have received your request to reset password for your account. As requested, we have generated a One-Time Password(OTP) to verify your Identity and allow you to create a new password</p>
          </td>
         </tr>
        <!-- header content Ends -->

        <!-- Verify section Starts -->
        <tr>
          <td align="left" bgcolor="#ffffff" style="
                border-top: 1px solid #D8D8D8;
                background-color:  #FAFAFA;
                padding: 29px 43px 32px 43px;
                color: #313131;
              ">
              <p style="font-size: 20px; font-weight: 500; line-height: 30px; ">Verification code</p>
              <p style="color: #44BA13; font-size: 30px; font-weight: 600; line-height: 36px; letter-spacing: 10px;">{{otp}}</p>
              <p style="font-size: 15px; font-weight: 400; line-height: 21px; padding-top: 12px; padding-bottom: 29px;">Please enter this OTP on the password reset page. This OTP is valid for the next <span style=" font-weight: 600;">10 minutes</span> and you will need to generate a new OTP if you exceed the time limit.</p>
              <p style="font-size: 15px; font-weight: 400; line-height: 21px;">If you didn’t request this, you can ignore this email or let us know.</p>
          </td>
        </tr>
        <!-- Verify section Ends -->       
        </table>
      </td>
    </tr>
    <!-- end copy block -->
  </table>
  <!-- end body -->
</body>

</html>
`

export default otpTemp
