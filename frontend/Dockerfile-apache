FROM node:16 as build-stage
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY ./ .
RUN npm run build

FROM httpd:2.4 as production-stage
RUN apt-get update && apt-get install -y \
    apache2-dev \
    libssl-dev \
    wget \
    && rm -rf /var/lib/apt/lists/*

RUN wget https://tequila.epfl.ch/download/2.0/tequila-apache-C-2.0.17.tgz -O tequila-apache.tgz && \
    tar -xvzf tequila-apache.tgz && \
    cd tequila-2.0.17/Apache/C/ && \
    apxs -c -i -DAPACHE2 -DUSESSL -lssl mod_tequila.c && \
    cd ../../.. && \
    rm -rf tequila-apache.tgz tequila-2.0.17

RUN mkdir -p /var/tequila && \
    chmod 777 /var/tequila

COPY httpd.conf /usr/local/apache2/conf/httpd.conf
COPY --from=build-stage /app/dist /usr/local/apache2/htdocs/
