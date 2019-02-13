const dbConnection = require('../../database/mySQLconnect');
const Controller = require('./Controller')

class CourseController extends Controller {
    constructor() {
        super()
        console.log('Constructor of CourseController is called.');
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
