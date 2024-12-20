import { MailerSend, EmailParams, Sender, Recipient } from "mailersend";
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();
const sendMail = async (email, subject, text) => {
    const mailerSend = new MailerSend({
        apiKey: process.env.MAILERSEND_API_KEY,
      });
      
      console.log(process.env.MAILERSEND_EMAIL)
      const sentFrom = new Sender(process.env.MAILERSEND_EMAIL, "Sales Sphere");
      
      const recipients = [
        new Recipient(email)
      ];
      
      
      const emailParams = new EmailParams()
        .setFrom(sentFrom)
        .setTo(recipients)
        .setSubject(subject)
        .setHtml(text);
      
      mailerSend.email
          .send(emailParams)
        .catch((error) => console.log(error));

}

export default sendMail;