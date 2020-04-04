FROM node:13.10.1-stretch as builder
ARG ENV
WORKDIR /react/app
ADD checklist-client checklist-client
RUN (cd checklist-client && yarn install --network-timeout 1000000)
RUN (cd checklist-client && yarn build:"$ENV")

FROM nginx:1.17-alpine
WORKDIR /etc/nginx/html
COPY --from=builder /react/app/checklist-client/build .
COPY nginx/site.conf /etc/nginx/conf.d/default.conf
CMD ["sh", "-c", "exec nginx -g 'daemon off;'"]