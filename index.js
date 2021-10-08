
const Koa = require('koa');
const Router = require('@koa/router');
const {Worker} = require("worker_threads");
const Comlink = require('comlink')
const nodeEndpoint = require('comlink/dist/umd/node-adapter')
  
const EventEmitter = require('events');


const worker = new Worker("./worker.js", {
  execArgv: ['--inspect=9229']
});

EventEmitter.setMaxListeners(0)
const api = Comlink.wrap(nodeEndpoint(worker));
async function init(ctx, next) {
  ctx.do = function (n) {
    return n
  }
  ctx.body = await api.doMath(Comlink.proxy(ctx), Comlink.proxy(next));
  // ctx.body = n;
  console.log(ctx.body, '===')
}


const app = new Koa();
const router = new Router();

let n = 0;
router.get('(.*)', async (ctx, next) => {
  console.log(++n)
  init(ctx, next)
  // ctx.body = '1'
});



app
  .use(router.routes());

app.listen(3001)