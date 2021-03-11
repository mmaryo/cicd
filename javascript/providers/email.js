import nodemailer from 'nodemailer';
import smtpTransport from 'nodemailer-smtp-transport';
import { generateError, generateSuccess } from '../providers/route.js';



const transporter = nodemailer.createTransport(smtpTransport({
    service: process.env.SERVICE_MAIL,
    host: process.env.HOST_MAIL,
    auth: {
        user: process.env.USER_MAIL,
        pass: process.env.PASSWORD_MAIL
    }
}));


export function sendEmailToForgotPassword(email, password, res) {
    // create option mail
    const mailOptions = {
        from: process.env.USER_MAIL,
        to: email,
        subject: 'Réinialisation du mot de passe de votre compte SAVES YOUR GAS ',
        text: `Voici votre mot de passe temporaire "${password}" .`
    };

    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            generateError(500, 'Server error', res);
        }
        else {
            generateSuccess(200, { message: 'Mail is send' }, res)
        }
    })


}    