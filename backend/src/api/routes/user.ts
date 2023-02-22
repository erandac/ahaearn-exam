import * as express from 'express'

export function testUser(req: express.Request, res: express.Response): void {
    const user = { name: "Eranda", id: 232984 }
    res.send(user)
}