const { parentPort } =  require("worker_threads");
const Comlink = require('comlink')
const nodeEndpoint = require('comlink/dist/umd/node-adapter')
const EventEmitter = require('events');

let n = 0
EventEmitter.setMaxListeners(0)
const api = {
  async doMath(ctx) {

    // proxy 直接复制无法使用await 同步
    // await (ctx.body = '4' + await ctx.do())
    const num = await ctx.do(++n)
    console.log(num, 'worker')
    return '4' + num
  },
};

Comlink.expose(api, nodeEndpoint(parentPort));