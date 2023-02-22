import config from 'config'
import { apiRoutes } from './api'
import { createServer } from './startup/server'
import path from 'path'
import { Server } from 'http';
import logger from './core/logger';
import { useSwaggerUi } from './startup/swagger'
import { ensureSchemaSync } from './startup/db-sync'
import { handleInputValidationError, hanldeInternalServerError } from './api/middleware'

const swaggerSpecPath = path.resolve(__dirname, '..', 'config', 'openapi.yml')

export async function appServer(): Promise<Server> {
    const app = await createServer(swaggerSpecPath, apiRoutes)

    // sync mysql database schema with Sequelize defined models
    await ensureSchemaSync()

    // enable swagger doc endpoint 
    useSwaggerUi(app, swaggerSpecPath)

    app.use(handleInputValidationError())
    app.use(hanldeInternalServerError())

    const port = process.env.PORT || config.get("serverPort");
    return app.listen(port, () => {
        logger.info(`App is listening on port ${port} !`)
    })
}

