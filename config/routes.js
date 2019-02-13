const courseCatalogRouter = require('./routes/course_catalog/catalog_routes.js'),
      loginRouter         = require('./routes/login/login_routes.js'),
      courseRouter        = require('./routes/course/course_routes.js'),
      defaultRouter       = require('./routes/default/default_routes.js');

const compose = require('koa-compose')

//https://github.com/koajs/koa/blob/master/docs/guide.md#middleware-best-practices

function combineRouters(routers) {

  return () => {
    routers = [...arguments]
    const middleware = []

    routers.forEach(router => {
      let { stack } = router
      stack.forEach(({ methods, path }) => {
        console.log(`${methods.filter(item => item !== 'HEAD')} - localhost:8239${path}`)
      })
      middleware.push(router.routes())
      middleware.push(router.allowedMethods())
    })

    return compose(middleware)
  }
}

const router = combineRouters(
  defaultRouter,
  courseCatalogRouter,
  loginRouter,
  courseRouter
)

module.exports = function (app) {
    app.use(router());
};


// select cb.subject, cb.catalog, cc.section, cb.course_title,
//        cb.units, cc.component, cc.class_number,
//        ci.instructor_fName, ci.instructor_lName
//        FROM course_base cb,
//             course_components cc,
//             course_instructors ci
//        WHERE cb.subject = 'CS' AND
//              cb.catalog = '315' AND
//              cb.class_number = cc.parent_class_number AND
//              cc.class_number = ci.class_number


// select cb.subject, cb.catalog, cc.section, cb.course_title,
//        cb.units, cc.component, cc.class_number,
//        ci.instructor_fName, ci.instructor_lName
//        FROM course_base cb,
//             course_components cc left join
//             course_instructors ci
//             on (cc.class_number = ci.class_number)
//        WHERE cb.subject = 'CS' AND
//              cb.catalog = '315' AND
//              cb.class_number = cc.parent_class_number AND
//              instructor_lName IS NULL;
