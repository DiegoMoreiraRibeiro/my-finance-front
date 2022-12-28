FROM node:lts as dependencies
WORKDIR /front-financeiro
COPY package.json yarn.lock ./
RUN yarn install --frozen-lockfile

FROM node:lts as builder
WORKDIR /front-financeiro
COPY . .
COPY --from=dependencies /front-financeiro/node_modules ./node_modules
RUN yarn build

FROM node:lts as runner
WORKDIR /front-financeiro
ENV NODE_ENV production
# If you are using a custom next.config.js file, uncomment this line.
# COPY --from=builder /front-financeiro/next.config.js ./
COPY --from=builder /front-financeiro/public ./public
COPY --from=builder /front-financeiro/.next ./.next
COPY --from=builder /front-financeiro/node_modules ./node_modules
COPY --from=builder /front-financeiro/package.json ./package.json

EXPOSE 3231
CMD ["yarn", "start-prd"]