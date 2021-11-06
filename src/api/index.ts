
import express from 'express'
import imagesRouter from './images'

const routes = express.Router()

routes.use("/api/images", imagesRouter)

routes.use(function (err: Error, req: express.Request, res: express.Response, next: Function) {
  console.error(err.stack)
  return res.status(500).json({
    "err":err.message
  })
})
export default routes

