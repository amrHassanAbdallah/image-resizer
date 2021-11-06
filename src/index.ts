
import express from 'express';
import router  from './api/';
import morgan from 'morgan';
import cors from 'cors';

const app = express()
const port = 3000


app.use('/', router)
app.use(cors());
app.use(morgan('dev'));

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})


export  {
  app
}