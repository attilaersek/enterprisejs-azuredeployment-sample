import {Request, Response} from 'express';
import express = require('express');

var port: number = process.env.PORT || 1337;
var app = express();

var renderIndex = (req: Request, res: Response) => {
    res.status(200).send('Hello, World!');
};

app.get('/*', renderIndex);

var server = app.listen(port, function() {
    var port = server.address().port;
    console.log('This express app is listening on port:' + port);
});
