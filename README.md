# Lancer

-   Using this Platform, Verified users can host their services and others can buy them by negotiating with the
-   seller.
-   For payment gateway, Paypal is used.
-   Cloudinary is used for cloud service, Notification is done through firebase, and socket.io is used to make the platform real-time.
-   This project has a total of 3 modules seller, buyer, and admin.
-   Admin panel is built with react using redux-toolkit for state management.
-   This project is containerized using docker.
-   The project is deployed through AWS.

##### Technologies Used:

-   <b>NodeJS</b> (v16.14.2)
-   <b>ExpressJS</b> (v4.17.3)
-   <b>Yarn</b> (v1.22.18)
-   <b>Typescript</b> (v4.6.2)
-   <b>Mongoose</b> (v6.2.7)
-   <b>Google Auth Library</b> (v7.14.0)
-   <b>Cloudinary</b> (v1.28.1)
-   <b>Socket.io</b> (v4.5.0)
-   <b>Redis</b>

##### API:

-   <b>Twilio</b>
-   <b>Paypal</b>
-   <b>Google Auth </b>

##### Hosting:

-   <b>AWS EC2</b>
-   <b>Nginx</b>

<br>

**API**

Website : [`https://lancer.unityshop.shop`](https://lancer.unityshop.shop)<br>
Source Code: [`https://github.com/naveen-murali/lancer.git`](https://github.com/naveen-murali/lancer.git)

<br>

**Admin Panal**

Website : [`https://lancer-admin.unityshop.shop`](https://lancer-admin.unityshop.shop)<br>
Source Code : [`https://github.com/naveen-murali/lancer-admin-panel.git`](https://github.com/naveen-murali/lancer-admin-panel.git)<br>

---

## **Requirements**

For running Lancer, you will only need [**Docker**](https://docs.docker.com/engine/install/) and [**Docker Compose**](https://docs.docker.com/compose/install/) or [**Nodejs**](https://nodejs.org/en/) (_make sure that the nodejs version is 16.14.2_) installed.

**Clone Repository**

    $ git clone https://github.com/naveen-murali/lancer.git
    $ cd lancer

**Configure app**

Create a `.env` file in your root directory. You will need:

```js
- PORT
- BODY_LIMIT (eg: "5gb" | "4mb")
- APP_URL (eg: "http://localhost:3000")
- REDIS_URL (eg: "redis://redis:6379")
- MULTER_FILE_LIMIT ( "in byte" )
- MONGODB_URI
- JWT_SECRET
- GOOGLE_CLIENT_ID
- TWILIO_SERVICE_ID
- TWILIO_ACCOUNTS_ID
- TWILIO_AUTH_TOKEN
- CLOUDINARY_CLOUD_NAME
- CLOUDINARY_API_KEY
- CLOUDINARY_API_SCRETE
- FIREBASE_PROJECT_ID
- FIREBASE_CLIENT_EMAIL
- FIREBASE_PRIVATE_KEY
- PAYPAL_MODE
- PAYPAL_CLIENT
- PAYPAL_SECRET
```

<br>

## **Running the project**

Running the application without docker<br>

**For Development**

    $ yarn dev

**For Production**

    $ yarn build
    $ yarn start

or

    $ yarn build:start

<br>

Running the application with docker

**For Production**

    $ docker-compose -f docker-compose.yml -f docker-compose-dev.yml up

**For Production**

    $ docker-compose up -d

---

## **API Documentation**

| Route        | Doc Link                                                 |
| ------------ | -------------------------------------------------------- |
| Auth         | https://documenter.getpostman.com/view/15914089/UVsSL2fo |
| Category     | https://documenter.getpostman.com/view/15914089/UVsTrNQ1 |
| Chats        | https://documenter.getpostman.com/view/15914089/UyxhoSvb |
| Lancer       | https://documenter.getpostman.com/view/15914089/UyxhoSvc |
| Orders       | https://documenter.getpostman.com/view/15914089/UyxhoSzt |
| Services     | https://documenter.getpostman.com/view/15914089/UVyswbBP |
| Transactions | https://documenter.getpostman.com/view/15914089/UyxhoSzu |
| Uploads      | https://documenter.getpostman.com/view/15914089/UVsSNipu |
| Users        | https://documenter.getpostman.com/view/15914089/UVsTphXM |

---

_For more information contact me on:_ **naveenmurali1999@gmail.com**
