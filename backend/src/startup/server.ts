import { connector, summarise } from 'swagger-routes-express'
import express, { Express } from 'express'
import YAML from 'yamljs'
//import logger from '@ahaearn/core/logger'
import logger from '../core/logger'


export async function createServer(swaggerSpecPath: string, api: any): Promise<Express> {
    const server = express()
    const swaggerDef = YAML.load(swaggerSpecPath)
    const connect = connector(api, swaggerDef, {
        onCreateRoute: (method: string, descriptor: any[]) => {
            descriptor.shift()
            logger.verbose(`${method}: ${descriptor.map((d: any) => d.name).join(', ')}`)
            //logger.verbose(`${method}: ${descriptor.map((d: any) => d.name).join(', ')}`)
        },
    })
    connect(server)
    return server
}
