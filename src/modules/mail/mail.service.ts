import { Injectable } from "@nestjs/common";
import { createTransport } from 'nodemailer';
import Mail from "nodemailer/lib/mailer";
import ical from "ical-generator";

import { CreateMeetingDto } from "src/interfaces/dtos/CreateMeeting.dto";
import { parse } from "date-fns";

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

    displayStartTimeslot(id: number) {
        const startHour = 8;
        const hour = Math.floor(startHour + id / 2);
        const minute = String((id % 2) * 30).padEnd(2, '0');

        return [hour, minute].join(':');
    }

    displayEndTimeslot(id: number) {
        const startHour = 8;
        const hour = Math.floor(startHour + id / 2);
        const minute = String((id % 2) * 30).padEnd(2, '0');

        if (minute == '00') {
            return [hour, '30'].join(':');
        }
        else {
            return [Number(hour) + 1, '00'].join(':')
        }

        return [hour, minute].join(':')
    }
    getIcalObject(start: number, end: number, title: string, desc: string, location: string, rDate: string) {
        const cal = ical({ name: title, description: desc });
        cal.createEvent({
            start: parse(`${rDate} ${this.displayStartTimeslot(start)}`, 'yyyy-MM-dd HH:mm', new Date()),
            end: parse(`${rDate} ${this.displayEndTimeslot(end)}`, 'yyyy-MM-dd HH:mm', new Date()),
            location: location,
            summary: desc
        });

        return cal;
    }

    async createMsg(c: CreateMeetingDto, files: Array<{ path: string }>) {

    }

    async sendMsg(title: string, context: string, dst: string, files: Array<{ path: string }>, obj = null) {
        const message: Mail.Options = {
            from: 'no-reply@shinycolors.moe',
            to: dst,
            subject: `Meeting announcement - ${title}`,
            text: context,
            attachments: files
        }

        if (obj) {
            message.icalEvent = {
                filename: 'invitation.ics',
                method: 'request',
                content: Buffer.from(obj.toString())
            }
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
