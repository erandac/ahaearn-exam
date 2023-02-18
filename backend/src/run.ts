import { appServer } from './app'

appServer()
    .then().catch(error => console.error(error))