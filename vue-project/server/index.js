const path = require('path');

const Koa = require('koa');

const Router = require('koa-router');

const multiparty = require('multiparty');



const app = new Koa();
const router = new Router();


router.post('/api/upload', async (ctx) => {

  console.log('receive upload');
  const form = new multiparty.Form({
    uploadDir: 'temp'
  });

  form.parse(ctx.req)

  form.on('file', (name, file) => {
    console.log(name, file);
  })

  ctx.response.body = '上传成功';

})

app.use(router.routes())

app.listen(4000, () => {
  console.log('server is running at port 4000');
})