const handlebars = require("handlebars");

var brevo = require('sib-api-v3-sdk');

let defaultClient = brevo.ApiClient.instance;

let apiKey = defaultClient.authentications['api-key'];
apiKey.apiKey = process.env.EMAIL_API_KEY;

let apiInstance = new brevo.TransactionalEmailsApi();
let sendSmtpEmail = new brevo.SendSmtpEmail();

const fs = require("fs");
const path = require("path");

const WelcomeMailTemplate = fs.readFileSync(
  path.join(__dirname, "../views/WelcomeMail.handlebars"),
  "utf-8"
);
const ForgotPasswordMailTemplate=fs.readFileSync(
  path.join(__dirname, "../views/ForgotPasswordMail.handlebars"),
  "utf-8"
);

const SendMailTransporter = async (template, subject, email,type) => {
  try {
    console.log("gigiigigigiggig",subject, email)
    const SignalArray=["BearishMail","BullishMail","NeutralMail","NoTradeMail"]
    sendSmtpEmail.subject = subject;
    sendSmtpEmail.sender={"name": "Option Consensus", "email":SignalArray.includes(type)? process.env.EMAIL:process.env.SUPPORT_EMAIL};
    sendSmtpEmail.htmlContent=template
    sendSmtpEmail.to = [
      { "email": email }
    ];
    await apiInstance.sendTransacEmail(sendSmtpEmail)

    console.log("hi transpotr2")
    return true;
  } catch (error) {
    if (error.response) {
      console.log(error)
      return false;
    }
  }
};


const cronTemplate = (data, templateType) => {
  const template = handlebars.compile(templateType);
  const messageBody = template({data});
  return messageBody;
};
const SendMailWithTemplate =async  (data, type) => {
  let templateType;
  if (type === "RegisterMailUser") {
    templateType = WelcomeMailTemplate;
  }
  if (type === "ForgotPasswordMailUser") {
    templateType = ForgotPasswordMailTemplate;
  }
  console.log("sent")

  const template =await  cronTemplate(data, templateType);
  console.log("sent2")

  const sent=  await SendMailTransporter(template, data.subject, data.email ,type);
  console.log(sent)
  return sent
};
module.exports = {
  cronTemplate,
  SendMailWithTemplate,
};
