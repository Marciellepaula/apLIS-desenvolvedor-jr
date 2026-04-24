FROM php:8.3-apache

RUN a2enmod rewrite \
  && docker-php-ext-install pdo pdo_mysql

WORKDIR /var/www/html

# Apache vhost (serve /public)
COPY apache/000-default.conf /etc/apache2/sites-available/000-default.conf

COPY public/ /var/www/html/public/
COPY src/ /var/www/html/src/

EXPOSE 80
