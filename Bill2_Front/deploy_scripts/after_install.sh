#!/usr/bin/env bash

sudo cp -rf /deploy/frontend/* /var/www/html

sudo cp /deploy/.env.development /var/www/html

cd /var/www

sudo chmod -R 777 html

cd html

sudo npm install

sudo npm run build

sudo systemctl restart nginx
