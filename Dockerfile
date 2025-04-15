FROM node:22.14-alpine3.21

WORKDIR /app

# Listening port
ARG PORT=3000
EXPOSE ${PORT}

ENV NEXT_TELEMETRY_DISABLED=1

COPY . .

RUN yarn install \
 && yarn cache clean
RUN yarn build

CMD ["yarn", "start"]
