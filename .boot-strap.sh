#prereqs
sudo apt-get update
sudo apt-get install git
sudo apt-get install docker
curl -L https://github.com/docker/compose/releases/download/1.3.2/docker-compose-`uname -s`-`uname -m` > /usr/local/bin/docker-compose
chmod +x /usr/local/bin/docker-compose

#Node TODO add node to path
curl https://raw.githubusercontent.com/creationix/nvm/v0.11.1/install.sh | bash
source ~/.profile 
nvm install v0.12.7
nvm use v0.12.7
nvm alias default v0.12.7

#Mongo
sudo apt-key adv --keyserver hkp://keyserver.ubuntu.com:80 --recv 7F0CEB10
echo 'deb http://downloads-distro.mongodb.org/repo/ubuntu-upstart dist 10gen' | sudo tee /etc/apt/sources.list.d/mongodb.list
sudo apt-get update
sudo apt-get install -y mongodb-org

#MEAN
sudo npm install -g bower grunt-cli yo generator-meanjs
