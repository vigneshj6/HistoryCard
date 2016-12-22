FROM base-os
COPY . .
RUN npm install
EXPOSE 8080
EXPOSE 8082
CMD npm start
