const path = require('path');

const Koa = require('koa');

const Router = require('koa-router');

const multiparty = require('multiparty');

const bodyParser = require('koa-bodyparser');

const app = new Koa();
const router = new Router();

app.use(bodyParser())

router.post('/api/upload', async (ctx) => {

  console.log('receive...');
  const form = new multiparty.Form({
    uploadDir: 'temp'
  });

  form.parse(ctx.req)

  form.on('file', (name, file) => {
    console.log('save:', name);
  })
  ctx.response.body = '上传成功';

})


router.get('/api/getTest', async (ctx) => {
  ctx.response.body = '成功';
})

router.post('/api/postTest', async (ctx) => {
  console.log(ctx.request.body);
  ctx.response.body = '上传成功';
})

app.use(router.routes())



app.listen(4000, () => {
  console.log('server is running at port 4000');
})