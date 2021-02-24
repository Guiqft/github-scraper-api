FROM node:12

# Create app directory
WORKDIR /scraper

COPY . .

RUN yarn
RUN yarn install-check

EXPOSE 8000

CMD [ "yarn", "start" ]