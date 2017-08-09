FROM alpine:edge
RUN apk add --no-cache chromium nodejs
RUN apk add --no-cache grep udev font-adobe-100dpi ttf-freefont
COPY ./dist /var/task/
WORKDIR /var/task

ENTRYPOINT ["/bin/sh"]
ENV CHROME_PATH=/usr/bin/chromium-browser
CMD ["-c", "node /var/task/src/index.js"]
