import { Request, Response} from 'express';
import * as express from 'express';
import appInsights = require('applicationinsights');
import { createFilter } from 'odata-v4-inmemory';

var start = +new Date;
const app = express();
const port = process.env.PORT || 1337;
var instrumentation: boolean = false;

if(!!process.env.APPINSIGHTS_KEY) {
  appInsights.setup(process.env.APPINSIGHTS_KEY).start();
  instrumentation = true;
}

app.get('/api/products', (req: Request, res: Response) => {
   let data = require('../data/products.json').value;
   if (req.query.$filter) {
     const filterFn = createFilter(req.query.$filter);
     data = data.filter(filterFn);
   }
   res.json(data);
});

var server = app.listen(port, function() {
    var port = server.address().port;
    var end = +new Date;
    var duration = end - start;
    console.log('This express app is listening on port:' + port);
    if(instrumentation === true) {
        appInsights.client.trackMetric('StartupTime', duration);
    }
});
