// ESM
// import axios from 'axios'

// http - npm i http
// express.js - npm i express
// fastify - npm i fastify
import http from "http";

const port = process.env.PORT || 8000;

const server = http.createServer((req, res) => {
    const { method } = req;

    switch (method) {
        case "GET":
            return handleGetMethod(res);
        case "POST":
            return handlePostMethod(res);
        case "PATCH":
            return handlePatchMethod(req, res);
        case "DELETE":
            return handleDeleteMethod(req, res);
        default:
            throw new Error(`Not supported method: ${method}`);
    }
});

function handleGetMethod(res) {
    res.end(JSON.stringify({ message: "Success" }));
}
function handlePostMethod(res) { }
function handlePatchMethod(req, res) { }
function handleDeleteMethod(req, res) { }

server.listen(port, () => {
    console.log(`Server is listening on port ${port}`);
});