FROM php:8.3-apache

RUN apt-get update \
  && apt-get install -y --no-install-recommends curl unzip \
  && rm -rf /var/lib/apt/lists/* \
  && a2enmod rewrite headers \
  && docker-php-ext-install pdo pdo_mysql \
  && curl -fsSL https://getcomposer.org/installer -o /tmp/composer-setup.php \
  && php /tmp/composer-setup.php --install-dir=/usr/local/bin --filename=composer \
  && rm -f /tmp/composer-setup.php

WORKDIR /var/www/html

# Apache vhost (serve /public)
COPY apache/000-default.conf /etc/apache2/sites-available/000-default.conf

COPY public/ /var/www/html/public/
COPY src/ /var/www/html/src/
COPY composer.json phpunit.xml /var/www/html/
COPY tests/ /var/www/html/tests/

EXPOSE 80
