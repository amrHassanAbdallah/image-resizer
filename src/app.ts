import 'reflect-metadata';
import config from './config';

import express from 'express';

import Logger from './loaders/logger';


const app = express()

async function startServer() {
  await require('./loaders').default({ expressApp: app });

  app.listen(config.port, () => {
    Logger.info(`
      ################################################
      🛡️  Server listening on port: ${config.port} 🛡️
      ################################################
    `);
  }).on('error', err => {
    Logger.error(err);
    process.exit(1);
  });

}

startServer()


export  {
  app
}
