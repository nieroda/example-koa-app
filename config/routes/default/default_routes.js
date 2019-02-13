const Authorize = require('../../../app/Authorize.js');


const router = require('koa-router')({
    prefix: '/api/v1'
});

router
  .get('/', ctx => ctx.body = 'Hello Thomas')

module.exports = router
