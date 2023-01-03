FROM node:lts as dependencies
WORKDIR /my-finance-front
COPY package.json ./
RUN npm install --frozen-lockfile

FROM node:lts as builder
WORKDIR /my-finance-front
COPY . .
COPY --from=dependencies /my-finance-front/node_modules ./node_modules
RUN npm build

FROM node:lts as runner
WORKDIR /my-finance-front
ENV NODE_ENV production
# If you are using a custom next.config.js file, uncomment this line.
# COPY --from=builder /my-finance-front/next.config.js ./
COPY --from=builder /my-finance-front/public ./public
COPY --from=builder /my-finance-front/.next ./.next
COPY --from=builder /my-finance-front/node_modules ./node_modules
COPY --from=builder /my-finance-front/package.json ./package.json

EXPOSE 8001
CMD ["npm", "start"]