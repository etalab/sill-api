# build environment
FROM node:14.16.0-alpine as build
WORKDIR /app
COPY package.json yarn.lock ./
RUN yarn install --frozen-lockfile
COPY . .
RUN npm install -g @vercel/ncc@0.34.0
RUN npx ncc build src/server/main.ts 

# production environment
FROM node:14.16.0-alpine
RUN apk add --update git
COPY --from=build /app/dist/index.js .    
RUN npm install -g forever
ENTRYPOINT sh -c "forever index.js"