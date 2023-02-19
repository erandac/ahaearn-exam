import { Sequelize } from 'sequelize-typescript';
import config from 'config'
import { User, EmailVerification } from './models'
import logger from '@earnaha/core/logger'

export const dbContext = new Sequelize(config.get("dbConnectionString"), {
    models: [User, EmailVerification],
    logging: (msg) => logger.info(msg)
});

