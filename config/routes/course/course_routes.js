const Course           = require('../../../app/Controllers/CourseController.js')
const CourseController = new Course()

// function forwardArgs(ctx) {
//   let { type, db_table, union, extra } = this
//
//   if (type === 'All') {
//     CourseController.genericAll()
//   } else if (type === 'Union') {
//     CourseController.genericUnion(ctx)
//   }
// }

const courseRouter = require('koa-router')({
  prefix: '/courses'
})

courseRouter.get('/', CourseController.genericAll.bind({
  "db_table": "course_catalog",
  "extra": "limit 100"
}))

courseRouter.get('/:term/:department/:catalog', CourseController.genericUnion.bind({
  "db_table": "course_base",
  "union": ["cb.term", "cb.department", "cb.catalog"]
}))


courseRouter.get('/:term/:department', CourseController.genericUnion.bind({
  "db_table": "course_base",
  "union": ["cb.term", "cb.department"]
}))

// courseRouter.get('/:term/all-ge-courses', CourseController.allGECoursesForTerm, err => console.log(`allCourses ran into an error: ${err}`))
// courseRouter.get('/all-instructors', CourseController.allInstructors)
//



// courseRouter.get('/:instructor_id/instructors', CourseController.genericUnion.bind({
//   "db_table": "course_instructors",
//   "union": ["instructor_id"]
// }))

// courseRouter.get('/:term', CourseController.genericUnion.bind({
//   "db_table": "course_base",
//   "union": ["cb.term"]
// }))
//
//
// courseRouter.get("/:term/:subject", CourseController.genericUnion.bind({
//   "db_table": "course_base",
//   "union": ["cb.term", "cb.subject"]
// }))


module.exports = courseRouter

// SELECT *
//        FROM course_base cb
//        INNER JOIN
//            course_components cc
//            ON cb.class_number = cc.class_number
//        LEFT JOIN
//            meeting_pattern mp
//            ON cc.class_number = mp.class_number
//        LEFT JOIN
//            course_instructors ci
//            ON cc.class_number = ci.class_number
//          cb.term = 2187 AND cb.department = 'Political Science'

// MariaDB [cs386_nkamm]> desc course_components;
// +---------------------+----------------------+------+-----+---------+-------+
// | Field               | Type                 | Null | Key | Default | Extra |
// +---------------------+----------------------+------+-----+---------+-------+
// | term                | varchar(4)           | NO   |     | NULL    |       |
// | class_number        | smallint(5) unsigned | NO   |     | NULL    |       |
// | parent_class_number | smallint(5) unsigned | NO   |     | NULL    |       |
// | section             | varchar(4)           | NO   |     | NULL    |       |
// | component           | varchar(6)           | NO   |     | NULL    |       |
// | class_type          | varchar(1)           | YES  |     | NULL    |       |
// | req_room_capacity   | smallint(5) unsigned | NO   |     | NULL    |       |
// +---------------------+----------------------+------+-----+---------+-------
//
//
// MariaDB [cs386_nkamm]> desc course_base;
// +-----------------------+----------------------+------+-----+---------+-------+
// | Field                 | Type                 | Null | Key | Default | Extra |
// +-----------------------+----------------------+------+-----+---------+-------+
// | term                  | varchar(4)           | NO   |     | NULL    |       |
// | subject               | varchar(8)           | NO   |     | NULL    |       |
// | catalog               | varchar(8)           | NO   |     | NULL    |       |
// | course_title          | varchar(40)          | NO   |     | NULL    |       |
// | department            | varchar(50)          | NO   |     | NULL    |       |
// | class_number          | smallint(5) unsigned | NO   |     | NULL    |       |
// | enrol_capacity        | smallint(5) unsigned | YES  |     | NULL    |       |
// | combined_class_number | smallint(5) unsigned | NO   |     | NULL    |       |
// | ge_designation        | varchar(4)           | YES  |     | NULL    |       |
// | units                 | varchar(8)           | YES  |     | NULL    |       |
// +-----------------------+----------------------+------+-----+---------+-------+
//

// MariaDB [cs386_nkamm]> desc meeting_pattern;
// +-----------------+----------------------+------+-----+---------+-------+
// | Field           | Type                 | Null | Key | Default | Extra |
// +-----------------+----------------------+------+-----+---------+-------+
// | term            | varchar(4)           | NO   |     | NULL    |       |
// | class_number    | smallint(5) unsigned | NO   |     | NULL    |       |
// | meeting_pattern | varchar(4)           | YES  |     | NULL    |       |
// | start_time      | time                 | YES  |     | NULL    |       |
// | end_time        | time                 | YES  |     | NULL    |       |
// | facility_name   | varchar(20)          | YES  |     | NULL    |       |
// | facility_cap    | smallint(5) unsigned | YES  |     | NULL    |       |
// +-----------------+----------------------+------+-----+---------+-------+
// 7 rows in set (0.00 sec)


// MariaDB [cs386_nkamm]> desc course_instructors
//     -> ;
// +---------------------+----------------------+------+-----+---------+-------+
// | Field               | Type                 | Null | Key | Default | Extra |
// +---------------------+----------------------+------+-----+---------+-------+
// | term                | varchar(4)           | NO   |     | NULL    |       |
// | class_number        | smallint(5) unsigned | NO   |     | NULL    |       |
// | parent_class_number | smallint(5) unsigned | YES  |     | NULL    |       |
// | instructor_id       | varchar(9)           | NO   |     | NULL    |       |
// | instructor_fName    | varchar(20)          | YES  |     | NULL    |       |
// | instructor_lName    | varchar(40)          | YES  |     | NULL    |       |
// | wtu                 | float                | NO   |     | NULL    |       |
// +---------------------+----------------------+------+-----+---------+-------+
//

// MariaDB [cs386_nkamm]> desc course_attributes;
// +-----------------+----------------------+------+-----+---------+-------+
// | Field           | Type                 | Null | Key | Default | Extra |
// +-----------------+----------------------+------+-----+---------+-------+
// | term            | varchar(4)           | NO   |     | NULL    |       |
// | class_number    | smallint(5) unsigned | NO   |     | NULL    |       |
// | total_enrolled  | smallint(6)          | NO   |     | NULL    |       |
// | available_seats | smallint(6)          | NO   |     | NULL    |       |
// | waitlist_size   | smallint(5) unsigned | NO   |     | NULL    |       |
// | ftes            | float                | YES  |     | NULL    |       |
// +-----------------+----------------------+------+-----+---------+-------+
//
//
//
// MariaDB [cs386_nkamm]> desc course_catalog;
// +------------------------+----------------------+------+-----+---------+-------+
// | Field                  | Type                 | Null | Key | Default | Extra |
// +------------------------+----------------------+------+-----+---------+-------+
// | acad_group             | varchar(2)           | NO   |     | NULL    |       |
// | subject                | varchar(8)           | NO   |     | NULL    |       |
// | catalog                | varchar(8)           | NO   |     | NULL    |       |
// | course_title_long      | varchar(256)         | NO   |     | NULL    |       |
// | catalog_description    | varchar(4096)        | NO   |     | NULL    |       |
// | grading_mode           | varchar(20)          | NO   |     | NULL    |       |
// | min_units              | varchar(5)           | NO   |     | NULL    |       |
// | max_units              | varchar(5)           | NO   |     | NULL    |       |
// | effective_date         | date                 | YES  |     | NULL    |       |
// | req_group              | varchar(10)          | YES  |     | NULL    |       |
// | perm_catalog_requisite | varchar(2048)        | YES  |     | NULL    |       |
// | course_repeatable      | varchar(1)           | YES  |     | NULL    |       |
// | units_repeat_limit     | smallint(5) unsigned | YES  |     | NULL    |       |
// | course_repeat_limit    | smallint(5) unsigned | YES  |     | NULL    |       |
// | typical_offering       | varchar(100)         | YES  |     | NULL    |       |
// +------------------------+----------------------+------+-----+---------+-------+
