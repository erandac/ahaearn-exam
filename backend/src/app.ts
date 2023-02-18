import config from 'config'
import * as api from './api'
import { createServer } from './startup/server'
import path from 'path'
import { Server } from 'http';

const swaggerSpecPath = path.resolve(__dirname, '..', 'config', 'openapi.yml')

export async function appServer(): Promise<Server> {
    const app = await createServer(swaggerSpecPath, api)
    const port = process.env.PORT || config.get("serverPort");
    return app.listen(port, () => {
        console.log(`App is listening on port ${port} !`)
    })
}

