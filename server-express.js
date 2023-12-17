import express from "express";
import { v4 as uuidv4 } from "uuid";
import { readFile, writeFile } from "node:fs/promises";

const server = express();

const port = process.env.PORT || 8000;

server.use(express.json());

server.get("/", async (req, res) => {
  res.status(200).json({ message: "Yay home path is working!" });
});

server.get("/users", async (req, res) => {
  try {
    // Read existing users from the file: https://nodejs.org/api/fs.html#fspromisesreadfilepath-options
    const data = await readFile("./data/users.json", { encoding: "utf8" });
    const users = JSON.parse(data);
    res.json(users);
  } catch (error) {
    res.json({ error: "Something went wrong!" });
  }
});

server.get("/users/:id", async (req, res) => {
  //   const {id} = req.params
  const id = req.params.id;

  try {
    const data = await readFile("./data/users.json", { encoding: "utf8" });
    const users = JSON.parse(data);

    // Find the user from the array with the specified ID
    const singleUser = users.find((user) => user.id === id);

    // If the user exist in the array, send it back as a response.
    // If not, send an error as a response.
    singleUser ? res.json(singleUser) : res.json({ error: "User not found" });
  } catch (error) {
    res.json({ error: "Something went wrong!" });
  }
});

server.delete("/users/:id", async (req, res) => {
  const userId = req.params.id;

  try {
    // Read existing users from the file: https://nodejs.org/api/fs.html#fspromisesreadfilepath-options
    const data = await readFile("./data/users.json", { encoding: "utf8" });
    const users = JSON.parse(data);

    // Find the index of the item with the specified ID
    const index = users.findIndex((user) => user.id === userId);

    // If the user is found, remove it from the array
    if (index !== -1) {
      users.splice(index, 1);

      // Write the updated users back to the file. https://nodejs.org/api/fs.html#fspromiseswritefilefile-data-options
      await writeFile("./data/users.json", JSON.stringify(users));

      res.status(200).json({ message: "User has been deleted successfully." });
    } else {
      res.status(404).json({ error: "User not found" });
    }
  } catch (error) {
    res.json({ error: "Something went wrong!" });
  }
});

server.post("/users", async (req, res) => {
  const newUser = req.body;

  //   Add id to the new item
  newUser.id = uuidv4();

  try {
    // Read existing items from the file
    const data = await readFile("./data/users.json", {
      encoding: "utf8",
    });

    const users = JSON.parse(data);

    // Add the new item
    users.push(newUser);

    // Write the updated items back to the file
    await writeFile("./data/users.json", JSON.stringify(users));

    res.status(200).json(newUser);
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// Endpoint to update (patch) a user by ID
server.patch("/users/:id", async (req, res) => {
  const userID = req.params.id;
  const updatedData = req.body;

  try {
    // Read existing users data from a file
    const data = await readFile("./data/users.json", {
      encoding: "utf8",
    });
    const users = JSON.parse(data);

    // Find the index of the item with the specified ID
    const index = users.findIndex((user) => user.id === userID);

    // If the item is found, update it with the new data
    if (index !== -1) {
      users[index] = { ...users[index], ...updatedData };

      // Write the updated items back to the file. https://nodejs.org/api/fs.html#fspromiseswritefilefile-data-options
      await writeFile("./data/users.json", JSON.stringify(users));
      res.status(200).json(users[index]);
    } else {
      res.status(404).json({ error: "User not found" });
    }
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
});

server.listen(port, () => {
  console.log(`Server is listening on port ${port}`);
});