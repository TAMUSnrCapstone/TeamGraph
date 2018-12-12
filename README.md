# Immersive Graphs
This is the repository for immersive graphs, built using nodejs, express, mongodb and vuejs.

## Build Setup
### Requirements
Node.js >= v8.10.0 , Yarn >= 1.12.3, and MongoDB >= 3.6.3
Please replace PRODUCTION_MONGO_SERVER, GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET, and PRODUCTION_URL with the appropriate information.

### Commands
``` bash
# install dependencies
yarn install

#start backend with hot reload at localhost:5000 (Make sure Mongo server is running locally on port 27017)
yarn run server

# serve frontend with hot reload at localhost:8080
yarn run dev

# build frontend for production with minification
yarn run build

# build  frontend for production and view the bundle analyzer report
yarn run build --report

#run production build of server (make sure to run build first)
yarn start
```

For a detailed explanation on how vue things work, check out the [guide](http://vuejs-templates.github.io/webpack/) and [docs for vue-loader](http://vuejs.github.io/vue-loader).
