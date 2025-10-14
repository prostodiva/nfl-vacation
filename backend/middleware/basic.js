const express = require('express');

const basicMiddleware = [
    express.json(),
    express.urlencoded({ extended: true })
];

module.exports = basicMiddleware;