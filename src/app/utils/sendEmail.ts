import nodemailer from 'nodemailer';
import config from '../config';

export const sendEmail = async (to: string, html: string) => {
    const transporter = nodemailer.createTransport({
        host: 'smtp.gmail.com',
        port: 587,
        secure: config.node_env === 'production', // true for port 465, false for other ports
        auth: {
            user: config.mailer_user,
            pass: config.node_mailer_pass
        }
    });

    await transporter.sendMail({
        from: config.mailer_user, // sender address
        to: to, // list of receivers
        subject: 'Reset your password within 10 mins!',
        text: '', // plain text body
        html: html // html body
    });
};
