FROM node:16.14.2-alpine
WORKDIR /lancer

COPY package.json .
COPY yarn.lock .

ARG NODE_ENV
RUN if [ "${NODE_ENV}" == "production" ]; \
    then \
        yarn install --production=true; \ 
        yarn add -D typescript tsc-alias; \
    else \
        yarn install; \
    fi

COPY . .
RUN if [ "${NODE_ENV}" == "production" ]; \
    then \
        yarn build; \
        yarn remove typescript tsc-alias; \
    fi

EXPOSE 3000

CMD yarn start