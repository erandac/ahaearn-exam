import { dbContext } from '@earnaha/persistence'
import config from 'config'

export async function ensureSchemaSync() {
    if (config.has('dbSyncOnStartup')) {

        switch (config.get('dbSyncOnStartup')) {
            case 'force':
                await dbContext.sync({ force: true })
                break;
            case 'partial':
                await dbContext.sync()
                break
        }
    }
}