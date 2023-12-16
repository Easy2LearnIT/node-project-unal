import express from 'express';
import { v4 as uuidv4 } from 'uuid';

const server = express();

const port = process.env.PORT || 8000;


server.use(express.json());

server.get("/", async (req, res) => {
    res.json({ message: "Yay home path is working!"})
});

server.get("/users", async (req, res) => {
    try {
        const response = await fetch("https://jsonplaceholder.typicode.com/users");
        const data = await response.json();
        res.status(200).emd(JSON.stringify(data));
    } catch (error) {
        throw Error('Something went wrong!');
    }
});



server.get("/users/:id", () => {});

server.delete("/users/:id", () => {});

server.post("/", () => {});

server.patch("/", () => {});

server.listen(port, () => {
    console.log(`Server is listening on port ${port}`)
});