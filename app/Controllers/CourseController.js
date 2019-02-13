const dbConnection = require('../../database/mySQLconnect');
const dateFormat = require('dateformat');

function now() {
    return dateFormat(new Date(), "yyyy-mm-dd HH:MM:ss");
}

let count = 0;

class CourseController {
    constructor() {
        console.log('Constructor of CourseController is called.');
    }

    static formatBodySuccess(startTime, tuples) {
      return {
        'success': true,
        'queryTime': new Date().getMilliseconds() - startTime.getMilliseconds(),
        'count': tuples.length,
        'data': tuples
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
            ctx.body = []
            ctx.status = 200
            return reject(error)
          }

          ctx.body = CourseController.formatBodySuccess(startTime, tuples)
          ctx.status = 200

          return resolve()
        })


      })
    }


    genericAll(ctx) {
      return new Promise((resolve, reject) => {

        let startTime = new Date();

        const query = `select * from ${this.db_table}`
        dbConnection.query({
          sql: query
        }, (error, tuples) => {
          // anon functions don't bind this
          if (error) {
            ctx.body = []
            ctx.status = 200
            return reject(error)
          }

          ctx.body = CourseController.formatBodySuccess(startTime, tuples)
          ctx.status = 200

          return resolve();
        })
      })
    }

    allInstructors(ctx) {
      return new Promise((resolve, reject) => {

        let startTime = new Date();

        const query = `select distinct
          instructor_fName,
          instructor_lName,
          instructor_id
          from
            course_instructors
          order by instructor_fName, instructor_lName;`
        dbConnection.query({
          sql: query
        }, (error, tuples) => {
          if (error) {
            ctx.body = []
            ctx.status = 200
            return reject(error)
          }

          ctx.body = CourseController.formatBodySuccess(startTime, tuples)
          ctx.status = 200
          return resolve()
        })
      })
    }



    async allGECoursesForTerm(ctx) {
        return new Promise((resolve, reject) => {
            const query = `
                       SELECT cb.term             term,
                               cb.subject          subject,
                               cb.catalog          catalog,
                               cb.course_title     course_title,
	                       cb.department       department,
                               cb.units
                        FROM
                            course_base cb
                        WHERE
	                    cb.ge_designation IS NOT NULL AND
                            cb.term = ?
	                ORDER BY cb.term, cb.subject, cb.catalog, cb.units
                        `;
            dbConnection.query({
                sql: query,
                values: [ctx.params.term, ctx.params.subject]
            }, (error, tuples) => {
                if (error) {
                    console.log("Connection error in CourseController::allCourses", error);
                    ctx.body = [];
                    ctx.status = 200;
                    return reject(error);
                }
                ctx.body = tuples;
                ctx.status = 200;
                return resolve();
            });
        }).catch(err => console.log("Database connection error.", err));
    }

}

module.exports = CourseController
