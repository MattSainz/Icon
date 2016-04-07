FROM node:4.2.1-onbuild

MAINTAINER Matthias Sainz

WORKDIR /home/mean

# Make everything available for start
ADD ./ /home/mean

RUN npm install 

#Install build-essential for node-gyp
#RUN apt-get update && apt-get install build-essential libkrb5-dev curl python -y

# Install Mean.JS Prerequisites
RUN npm install -g grunt-cli && npm install -g bower && npm install -g grunt 

# Install Mean.JS packages

# Manually trigger bower. Why doesnt this work via npm install?
ADD .bowerrc /home/mean/.bowerrc
ADD bower.json /home/mean/bower.json
RUN bower install --config.interactive=false --allow-root

ENV NODE_ENV production
RUN grunt build

# Port 3000 for server
# Port 35729 for livereload
EXPOSE 3000 35729
CMD ["grunt"]
