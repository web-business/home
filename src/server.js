import path from 'path';
import express from 'express';
import React from 'react';
import ReactDOM from 'react-dom/server';
import Test from './routes/Test';

global.navigator = global.navigator || {};
global.navigator.userAgent = global.navigator.userAgent || 'all';

var app = express();

app.use(express.static(path.resolce(__dirname, 'public')));

app.get('*', function (req, res, next) {
    try {
        var html = ReactDOM.renderToStaticMarkup(<Test />);
        res.status(route.status || 200);
        res.send(`<!doctype html>${html}`);

    } catch(e) {
        next(e);
    }
});

app.use(function (err, req, res, next) {
    res.status(500).send('服务器错误');
});

app.use((req, res) => {
    res.status(404).send('404');
});