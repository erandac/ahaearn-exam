import swaggerUi from 'swagger-ui-express'
import { Express, Request, Response } from 'express'
import YAML from 'yamljs'
import logger from '@earnaha/core/logger'

export const useSwaggerUi = function (app: Express, swaggerFilePath: string, path: string = '/api-docs') {
    const swaggerDocument = YAML.load(swaggerFilePath)
    var options = {}

    app.use('/api-docs', function (req: any, res: Response, next: any) {
        swaggerDocument.host = req.get('host');
        req.swaggerDoc = swaggerDocument;
        next();
    }, swaggerUi.serveFiles(swaggerDocument, options), swaggerUi.setup());

    logger.info("Swagger document UI enabled on endpoint /api-docs")
}