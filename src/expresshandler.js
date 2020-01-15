const express = require('express');

/** @class ExpressHandler
 *
 * @property {MVLoader} App
 * @property {MVTools} MT
 * @property {express} express
 */

class ExpressHandler {

    config = {};
    defaults = {
        express: {},
        port: 3000,
        routes: {
            get: {},
            post: {},
            put: {},
            delete: {},
        }
    };

    constructor(App, config) {
        this.App = App;
        this.MT = this.App.MT;
        this.loadConfig(config);
        this.express = express();
    }

    async loadConfig (config) {
        this.config = this.MT.mergeRecursive(this.defaults, this.config, config);
    }

    applyRoutes () {
        for (let method in this.config.routes) {
            if (this.config.routes.hasOwnProperty(method)) {
                for (let route in this.config.routes[method]) {
                    if (this.config.routes[method].hasOwnProperty(route)) {
                        let handler = this.MT.extract(this.config.routes[method][route]);
                        if (!this.MT.empty(handler)) {
                            this.express[method](route, (request, response) => handler(this, request, response));
                        }
                    }
                }
            }
        }
    }

    init () {
        this.applyRoutes();
        this.launch();
    }

    launch () {
        this.express.listen(this.config.port);
    }
}

module.exports = ExpressHandler;