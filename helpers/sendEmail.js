const sgMail = require("@sendgrid/mail");
require("dotenv").config();

const { EMAIL, SENDGRID_API_KEY } = process.env;

sgMail.setApiKey(SENDGRID_API_KEY)

const sendEmail = async (data) => {
    const email = { ...data, from: `${EMAIL}` };
    await sgMail.send(email)
        .then(() => console.log("Email send success"))
        .catch(error => console.log(error.message))
};

module.exports = sendEmail;