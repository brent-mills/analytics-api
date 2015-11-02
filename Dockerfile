FROM dockerrepo:5000/centos-template

MAINTAINER BMills

ENV NODE_SRC /usr/local/src/node

# install node and npm
RUN yum -y install nodejs npm

# create a node directory
RUN mkdir /usr/local/src/node/

# install base packages for node in the correct directory
WORKDIR /usr/local/src/node/
RUN npm install express kafka-node

# add our .js files to directory
ADD ./src /usr/local/src/node/

# exposing different port
EXPOSE 8125

# run our app
CMD [ "node", "kafka-node.js" ]


