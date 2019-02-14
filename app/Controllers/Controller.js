const dbConnection = require('../../database/mySQLconnect');



class Controller {

  constructor () { console.log('Constructor called for Base Class') }

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

  static formatGenericQuery(whereClause, extra = "") {

    let union = whereClause.map((value, idx) => {
      if (idx === whereClause.length - 1)
        return `${value} = ?`
      else if (idx === 0)
        return `WHERE ${value} = ? AND `
      return `${value} = ? AND `
    }).join('')


    return `
      SELECT *
        FROM course_base cb
        INNER JOIN
            course_components cc
            ON cb.class_number = cc.class_number
        LEFT JOIN
            meeting_pattern mp
            ON cc.class_number = mp.class_number
        LEFT JOIN
            course_instructors ci
            ON cc.class_number = ci.class_number
          ${union}
          ${extra}
    `
  }

  genericUnion(ctx) {
    return new Promise((resolve, reject) => {

      let startTime = new Date();

      let { db_table, union } = this

      const query = Controller.formatGenericQuery(union)

      console.log(`Query is >>> ${query} <<< `)

      dbConnection.query({
        sql: query,
        values: union.map(item => ctx.params[item.replace(/^cb.|^cc.|^ci./, "")])
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
      let extra = this.extra

      const query = Controller.formatGenericQuery([], extra)

      // const query = `select * from ${db_table} ${extra}`

      console.log(`Query is >>> ${query} <<<`)

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
