import {Request, Response} from 'express';
import express = require('express');
import appInsights = require('applicationinsights');

var start = +new Date;

var port: number = process.env.PORT || 1337;
var instrumentation: boolean = false;

if(!!process.env.APPINSIGHTS_KEY) {
  appInsights.setup(process.env.APPINSIGHTS_KEY).start();
  instrumentation = true;
}

var app = express();

var renderIndex = (req: Request, res: Response) => {
    res.status(200).send('Hello, World!');
};

app.get('/*', renderIndex);

var server = app.listen(port, function() {
    var port = server.address().port;
    var end = +new Date;
    var duration = end - start;
    console.log('This express app is listening on port:' + port);
    if(instrumentation === true) {
        appInsights.client.trackMetric('StartupTime', duration);
    }
});
