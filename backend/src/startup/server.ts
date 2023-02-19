import { connector, summarise } from 'swagger-routes-express'
import express, { Express } from 'express'
import YAML from 'yamljs'
import logger from '@earnaha/core/logger'


export async function createServer(swaggerSpecPath: string, api: any): Promise<Express> {
    const server = express()
    const swaggerDef = YAML.load(swaggerSpecPath)
    const connect = connector(api, swaggerDef, {
        onCreateRoute: (method: string, descriptor: any[]) => {
            descriptor = descriptor.concat([])
            descriptor.shift()
            logger.info(`Route created for ${method}: ${descriptor.map((d: any) => d.name).join(', ')}`)
        },
    })
    connect(server)
    return server
}
