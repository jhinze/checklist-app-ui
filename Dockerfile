FROM node:13.10.1-stretch as builder
ENV ENV=prod
WORKDIR /react/app
ADD . .
RUN yarn install --network-timeout 1000000
RUN yarn build:"$ENV"

FROM nginx:1.17-alpine
WORKDIR /etc/nginx/html
COPY --from=builder /react/app/build .
COPY nginx/site.conf /etc/nginx/conf.d/default.conf
CMD ["sh", "-c", "exec nginx -g 'daemon off;'"]