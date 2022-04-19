import paypal from 'paypal-rest-sdk';

const configPaypal = () => {
    paypal.configure({
        mode: "sandbox",
        client_id: `${process.env.PAYPAL_CLIENT}`,
        client_secret: `${process.env.PAYPAL_SECRET}`
    });
};

export { paypal, configPaypal };