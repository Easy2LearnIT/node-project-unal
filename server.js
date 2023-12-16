import express from 'express';
import { v4 as uuidv4 } from 'uuid';
import { readFile, writeFile } from "node:fs/promises"; 

const server = express();

const port = process.env.PORT || 8000;


server.use(express.json());

server.get("/", async (req, res) => {
    res.json({ message: "Yay home path is working!"})
});

server.get("/users", async (req, res) => {
    try {
        const data = await readFile("./data/users.json", { encoding: "utf8"});
        const users = JSON.parse(data);
        res.json(users);
    } catch (error) {
        res.json({ error: "Something went wrong!"});
    }
});

server.get("/users/:id", () => {}); 

server.delete("/users/:id", () => {});

server.post("/", () => {});

server.patch("/", () => {});

server.listen(port, () => {
    console.log(`Server is listening on port ${port}`)
});