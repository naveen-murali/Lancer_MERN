import twilio from "twilio";
import TwilioClient from "twilio/lib/rest/Twilio";

let client: TwilioClient;
const createTwilioClient = () => {
    client = twilio(process.env.TWILIO_ACCOUNTS_ID, process.env.TWILIO_AUTH_TOKEN);
};

export { createTwilioClient, client };
