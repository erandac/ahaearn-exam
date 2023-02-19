// import request from 'supertest';
// import { appServer } from '@earnaha/app'
// import { Server } from 'http'

// let server: Server

// const API_PREFIX = '/api/v1'

// describe('GET /temp-user', () => {

//     beforeEach(async () => {
//         server = await appServer();
//     })

//     afterEach(async () => {
//         if (server) {
//             server.close()
//         }
//     })

//     it('should return 200 and hardcorded user object', async () => {
//         const res = await request(server)
//             .get(`${API_PREFIX}/temp-user`)
//             .expect(200)
//         expect(res.body).toMatchObject({ id: 232984, name: 'Eranda' })
//     })

// })
