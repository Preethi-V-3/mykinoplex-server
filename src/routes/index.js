// routes/index.js
import theatersAPI from './api/theatersAPI';
import moviesAPI from './api/moviesAPI';
import showsAPI from './api/showsAPI';
import usersAPI from './api/usersAPI';

export default function (app) {
    // require all API endpoints
    /* fs.readdirSync(`${__dirname}/api/`).forEach((file) => {
        var basename = file.substr(0, file.indexOf('.'));
        require(`./api/${basename}`)(app);
      }); */

    app.use('/api/admin', usersAPI);
    app.use('/api/theaters', theatersAPI);
    app.use('/api/movies', moviesAPI);
    app.use('/api/showdetails', showsAPI);

    //all errors are handled below
    app.use('*', function (req, res, next) {
        res.status(404).send('URL ' + req.url + ' Not Found');
    });
}
