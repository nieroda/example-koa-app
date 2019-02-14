const dbConnection = require('../../database/mySQLconnect');



class Controller {

  constructor () { console.log('Constructor called for base class') }

  static getTime(time) { new Date().getMilliseconds() - time.getMilliseconds() }

  static formatBodySuccess(startTime, tuples) {
    return {
      'success': true,
      'timeElapsed': Controller.getTime(startTime),
      'count': tuples.length,
      'data': tuples
    }
  }

  static formatBodyError(startTime, error) {
    return {
      'success': false,
      'timeElapsed': Controller.getTime(startTime),
      error
    }
  }

  genericUnion(ctx) {
    return new Promise((resolve, reject) => {

      let startTime = new Date();

      let { db_table, union } = this

      const query = `select * from ${db_table} WHERE ${
        union.map((value, idx) => {
          if (idx === union.length - 1)
            return `${value} = ?;`
          return `${value} = ? AND `
        }).join('')}`


      dbConnection.query({
        sql: query,
        values: union.map(item => ctx.params[item])
      }, (error, tuples) => {
        if (error) {
          ctx.body = Controller.formatBodyError(startTime)
          ctx.status = 200
          return reject(error)
        }

        ctx.body = Controller.formatBodySuccess(startTime, tuples)
        ctx.status = 200

        return resolve()
      })
    })
  }

  genericAll(ctx) {
    return new Promise((resolve, reject) => {

      let startTime = new Date();

      let { db_table } = this
      let extra = this.extra || ""


      const query = `select * from ${db_table} ${extra}`
      dbConnection.query({
        sql: query
      }, (error, tuples) => {
        // anon functions don't bind this
        if (error) {
          ctx.body = Controller.formatBodyError(startTime)
          ctx.status = 200
          return reject(error)
        }

        ctx.body = Controller.formatBodySuccess(startTime, tuples)
        ctx.status = 200

        return resolve();
      })
    })
  }
}

module.exports = Controller
