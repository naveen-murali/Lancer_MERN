import twilio from 'twilio';
import TwilioClient from 'twilio/lib/rest/Twilio';

let client: TwilioClient;
const createTwilioClient = () => {
    client = twilio(process.env.ACCOUNTS_ID, process.env.AUTH_TOKEN);
};

export {
    createTwilioClient,
    client
};