import config from 'config'
import * as api from './api'
import { createServer } from './startup/server'
import path from 'path'
import { Server } from 'http';
import logger from './core/logger';
import { useSwaggerUi } from './startup/swagger'
import { ensureSchemaSync } from './startup/db-sync'

const swaggerSpecPath = path.resolve(__dirname, '..', 'config', 'openapi.yml')

export async function appServer(): Promise<Server> {
    const app = await createServer(swaggerSpecPath, api)

    // sync mysql database schema with Sequelize defined models
    ensureSchemaSync()

    // enable swagger doc endpoint 
    useSwaggerUi(app, swaggerSpecPath)

    const port = process.env.PORT || config.get("serverPort");
    return app.listen(port, () => {
        logger.info(`App is listening on port ${port} !`)
    })
}

