###################
# DEVELOPMENT STAGE
###################
FROM node:20-alpine AS development

WORKDIR /usr/src/app

COPY --chown=node:node ../package*.json ./
RUN apk add --no-cache git
RUN npm ci

COPY --chown=node:node ../ ./

RUN npx prisma generate

USER node

###################
# BUILD STAGE
###################
FROM node:20-alpine AS build

WORKDIR /usr/src/app

COPY --chown=node:node ../package*.json ./
COPY --chown=node:node --from=development /usr/src/app/node_modules ./node_modules
COPY --chown=node:node ../ ./

RUN npm run build

USER node

###################
# PRODUCTION STAGE
###################
FROM node:20-alpine AS production

WORKDIR /usr/src/app

COPY --chown=node:node --from=build /usr/src/app/node_modules ./node_modules
COPY --chown=node:node --from=build /usr/src/app/prisma ./prisma
COPY --chown=node:node --from=build /usr/src/app/dist ./dist
COPY --chown=node:node --from=build /usr/src/app/package.json ./package.json
COPY --chown=node:node ../docker/migrate.sh ./migrate.sh

RUN chmod +x ./migrate.sh

EXPOSE 3000

ENTRYPOINT ["./migrate.sh"]
CMD ["node", "dist/main.js"]
