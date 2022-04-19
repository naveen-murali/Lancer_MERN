import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
    host: "gmail",
    port: 587,
    secure: false, // true for 465, false for other ports
    auth: {
        user: "naveenmurali1211@gmail.com",
        pass: "nzhcuzsxgspetgxc"
    },
});


export const SEND_MAIL = async (/* to: string, mail: string */) => {
    transporter.sendMail({
        from: "naveenmurali1211@gmail.com", 
        to: "reshin1@gmail.com", 
        subject: "Hello ✔", 
        text: "Hello world?",
        html: "<b>Hello world?</b>"
    });
};
