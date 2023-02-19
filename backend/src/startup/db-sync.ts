import { dbContext } from '@earnaha/persistence'
import config from 'config'

export function ensureSchemaSync() {
    if (config.has('dbSyncOnStartup')) {

        switch (config.get('dbSyncOnStartup')) {
            case 'force':
                dbContext.sync({ force: true })
                break;
            case 'partial':
                dbContext.sync()
                break
        }
    }
}