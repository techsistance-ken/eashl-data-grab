FROM alpine:latest

# Install NodeJS and npm
RUN apk update
RUN apk add --no-cache nodejs npm

COPY dist eashl/
# RUN ls -la /eashl/*

WORKDIR /eashl/
RUN npm install
EXPOSE 8080