require("dotenv").config();
const { renderFile } = require("ejs");
const path = require("path");
const mailer = require("nodemailer");
const { createModulerLogger } = require("../LoggerServices/loggerservices");

const logger = createModulerLogger("emailservices");
// require("dotenv").config();
//---------------------------------------------------email- services---------------------------------------------------------------------------------------
const transport = mailer.createTransport({
  auth: {
    user: process.env.EMAIL_USERNAME,
    pass: process.env.EMAIL_PASSWORD,
  },
  host: process.env.EMAIL_HOST,
  port: process.env.EMAIL_AUTH_PORT
});



function mailSendingFunc(data,results,subject){
  return new Promise(function(res,rej){
    try{
      transport.sendMail(
        {
          to: results,
          from: process.env.EMAIL_SENDER,
          subject: subject || "NFT-Marketplace",
          html: data,
        },
        function (err, data) {
          if(!err){
            console.log("email sent successfully");
            res(data)
          }else{
            console.log("error in sending mail 31", err);
            rej(err)
          }
        }
      );
    }catch(err){
      rej(err)
    }
  })
}

class EmailServices {
  static async sendTestMail(Credential, templatePath, templateVars, emailSubject) {
    try {
      const data = await renderFile(templatePath, templateVars);
      let checkEmailSent;
      if(Credential.multipleEmail){
        checkEmailSent = await mailSendingFunc(data,Credential.multipleEmail,emailSubject);
      }else if(Credential.email){
        checkEmailSent = await mailSendingFunc(data,Credential.email,emailSubject);
      }else{
        return false;
      }
      
      if(checkEmailSent && checkEmailSent.accepted){
        return true;
      }
      return false;
    } catch (err) {
      console.log("err",err)
      logger.error(err);
      return false

    }
  }

  static async sendMailToAdminAndUser(Credential) {
    try {

      if(!Credential.admin || !Credential.user || !Credential.admin.templatePath || !Credential.user.templatePath || !Credential.admin.vars || !Credential.user.vars || !Credential.admin.templateSubject || !Credential.user.templateSubject){
        return false;
      }

      let emailSentStatus = {
        admin: false,
        user: false
      }

      for(let i in Credential){
        let emailSent = await this.sendTestMail(Credential[i].vars,Credential[i].templatePath,Credential[i],Credential[i].templateSubject);
        if(emailSent){
          emailSentStatus[i] = true;
        }
      }

      return emailSentStatus;
    } catch (err) {
      logger.error(err);
      return false

    }
  }

 
}

module.exports = EmailServices;