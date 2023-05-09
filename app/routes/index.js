const applicationsRoutes = require('./applicationsRoutes');
const companiesRoutes = require('./companiesRoutes');
const projectsRoutes = require('./projectsRoutes');
const adminRoutes = require('./adminRoutes');

exports.routes = function (app) {

    // Applications
    app.use('/applications', applicationsRoutes)

    // Companies
    app.use('/companies', companiesRoutes)

    // Projects
    app.use('/projects', projectsRoutes)

    // Admin
    app.use('/admin', adminRoutes)

    // Data
    app.use('/data', (req, res, next) => {
        res.render('data');
    })

    // About
    app.get('/about', (req, res, next) => {
        res.render('about');
    })

};