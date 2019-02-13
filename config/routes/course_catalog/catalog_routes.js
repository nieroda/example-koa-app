// const Authorize = require('../../app/Authorize.js')
const CourseCatalog = require('../../../app/Controllers/CourseCatalogController.js')

const CourseCatalogController = new CourseCatalog()

const courseCatalogRouter = require('koa-router')({
    prefix: '/course-catalog'
})

courseCatalogRouter
  .get('/all-course-descriptions', CourseCatalogController.courseDescriptionsAllCourses, console.log)
  .get('/:subject/course-descriptions', CourseCatalogController.courseDescriptionsForSubject)
  .get('/:subject/:catalog/course-descriptions', CourseCatalogController.courseDescriptionForSubjectAndCatalog)

module.exports = courseCatalogRouter
