const applicationRoutes = require('./applicationRoutes');
const companyRoutes = require('./companyRoutes');

exports.routes = function (app) {

    // Application
    app.use('/application', applicationRoutes)

    // Company
    //app.use('/company', companyRoutes)

};