module.exports = {
  info: {
    title: 'Event Management',
    version: '0.0.1',
    description: 'Event Management documentation',
    termsOfService: 'https://zuru.tech/terms',
    contact: {
      email: 'apiteam@zuru.tech',
    },
    license: {
      name: 'Dreamcatcher license',
      url: 'https://zuru.tech/Dreamcatcher/licenses/LICENSE.html',
    },
  },
  host: 'localhost:3333',
  basePath: '/',
  apis: ['./src/component/**/*.route.js'],
  schemes: ['http'],
  consumes: ['application/json'],
  produces: ['application/json'],
};
