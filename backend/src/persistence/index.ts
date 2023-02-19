import { Sequelize } from 'sequelize-typescript';
import config from 'config'
import { User } from './models/user.model'
import logger from '@earnaha/core/logger'

export const dbContext = new Sequelize(config.get("dbConnectionString"), {
    models: [User],
    logging: (msg) => logger.info(msg)
});

