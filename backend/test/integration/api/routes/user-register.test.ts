import request from 'supertest';
import { appServer } from '@earnaha/app'
import { Server } from 'http'
import { dbContext } from '@earnaha/persistence'
import { User } from '@earnaha/persistence/models'
import { pick, omit } from 'lodash'


let server: Server

const API_PREFIX = '/api/v1'
const validPassword = 'Wd&83xd!'
const invalidPassword = 'aaaaaaaa'
const validUserRegistration = {
    "firstName": "eranda ",
    "lastName": "nandasena ",
    "email": "erandac@gmail.com",
    "password": validPassword,
    "termAndPolicy": true
}
const requiredFileds = ['firstName', 'lastName', 'email', 'password', 'termAndPolicy']

const userRegPath = `${API_PREFIX}/user/register-internal-auth`

describe('POST /user/register-internal-auth', () => {

    beforeEach(async () => {
        server = await appServer();
    })

    afterEach(async () => {
        await dbContext.getRepository(User).truncate()
        if (server) {
            server.close()
        }
    })

    requiredFileds.forEach((field) => {
        it(`should return 400 when required field '${field}' is missing`, async () => {
            const res = await request(server)
                .post(userRegPath)
                .send(omit(validUserRegistration, [field]))
                .expect(400)
            expect(res.body).toEqual(expect.objectContaining({
                errors: [
                    expect.objectContaining({ code: 'validation_error' })
                ]
            }))
        })
    })

    it('should return 400 when invalid password', async () => {
        const res = await request(server)

            .post(userRegPath)
            .send({ ...validUserRegistration, ...{ password: invalidPassword } })
            .expect(400)
        expect(res.body).toEqual(expect.objectContaining({
            errors: [
                expect.objectContaining({ code: 'validation_error' })
            ]
        }))
    })

    it('should return 400 when termAndPolicy is false', async () => {
        const res = await request(server)
            .post(userRegPath)
            .send({ ...validUserRegistration, ...{ termAndPolicy: false } })
            .expect(400)
        expect(res.body).toEqual(expect.objectContaining({
            errors: [
                expect.objectContaining({ code: 'validation_error' })
            ]
        }))
    })

    it('should return 400 when register user with same email address', async () => {
        const res = await request(server)
            .post(userRegPath)
            .send(validUserRegistration)
            .expect(200)

        expect(res.body).toHaveProperty('id')

        const res2 = await request(server)
            .post(userRegPath)
            .send(validUserRegistration)
            .expect(400)

        expect(res2.body).toEqual(expect.objectContaining({
            errors: [
                expect.objectContaining({ code: 'item_already_exists' })
            ]
        }))
    })

    it('should return 200 and user id for valid user registration object', async () => {
        const res = await request(server)
            .post(userRegPath)
            .send(validUserRegistration)
            .expect(200)
        console.log(res.body)
        expect(res.body).toHaveProperty('id')
    })

})
