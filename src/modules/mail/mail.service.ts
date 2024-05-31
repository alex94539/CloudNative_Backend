import { Injectable } from "@nestjs/common";
import { createTransport } from 'nodemailer';
import Mail from "nodemailer/lib/mailer";
import { CreateMeetingDto } from "src/interfaces/dtos/CreateMeeting.dto";

@Injectable()
export class MailService {
    constructor() { }

    mailTransporter = createTransport(
        {
            service: 'gmail',
            // auth: {
            //     user: 'noctchill283pro.11@gmail.com',
            //     pass: 'txownxevphqdwibh'
            // }
            auth: {
                user: 'straylight283pro.11@nycu.edu.tw',
                pass: 'wrlveczmzpwtrmle'
            }
        }
    );

    async createMsg(c: CreateMeetingDto, files: Array<{ path: string }>) {

    }

    async sendMsg(title: string, context: string, dst: string, files: Array<{path: string}>) {
        const message: Mail.Options = {
            from: 'no-reply@shinycolors.moe',
            to: dst,
            subject: `Meeting announcement - ${title}`,
            text: context,
            attachments: files
        }

        this.mailTransporter.sendMail(message, (err, data) => {
            if (err) {
                console.log(err);
                console.log('Error on email sending');
            }
            else {
                console.log('Mail sent successfully');
            }
        });
    }
}
