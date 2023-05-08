const applicationsRoutes = require('./applicationsRoutes');
const companiesRoutes = require('./companiesRoutes');
const projectsRoutes = require('./projectsRoutes');

exports.routes = function (app) {

    // Applications
    app.use('/applications', applicationsRoutes)

    // Companies
    app.use('/companies', companiesRoutes)

    // Projects
    app.use('/projects', projectsRoutes)

    // Data
    app.use('/data', (req, res, next) => {
        res.render('data');
    })

    // About
    app.get('/about', (req, res, next) => {
        res.render('about');
    })

};