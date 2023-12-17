// Import the framework and instantiate it
import Fastify from "fastify";
import { v4 as uuidv4 } from "uuid";
import { readFile, writeFile } from "node:fs/promises";

const fastify = Fastify({
  logger: true,
});

const port = process.env.PORT || 8000;

// Declare a route
fastify.get("/", async function handler(request, reply) {
  return { message: "Yay! Home path is working." };
});

fastify.get("/users", async (request, reply) => {
  try {
    // Read existing users from the file: https://nodejs.org/api/fs.html#fspromisesreadfilepath-options
    const data = await readFile("./data/users.json", { encoding: "utf8" });
    const users = JSON.parse(data);

    return users;
  } catch (error) {
    return { error: "Something went wrong!" };
  }
});

fastify.get("/users/:id", async (request, reply) => {
  //   const {id} = request.params
  const id = request.params.id;

  try {
    const data = await readFile("./data/users.json", { encoding: "utf8" });
    const users = JSON.parse(data);

    // Find the user from the array with the specified ID
    const singleUser = users.find((user) => user.id === id);

    // If the user exist in the array, send it back as a response.
    // If not, send an error as a response.
    if (singleUser) {
      return singleUser;
    } else {
      return { error: "User not found" };
    }
  } catch (error) {
    res.json({ error: "Something went wrong!" });
  }
});

fastify.delete("/users/:id", async (request, reply) => {
  const userId = request.params.id;

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

      return { message: "User has been deleted successfully." };
    } else {
      return { error: "User not found" };
    }
  } catch (error) {
    return { error: "Something went wrong!" };
  }
});

fastify.post("/users", async (request, reply) => {
  const newUser = request.body;

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

    return newUser;
  } catch (error) {
    return { error: "Internal Server Error" };
  }
});

// Endpoint to update (patch) a user by ID
fastify.patch("/users/:id", async (request, reply) => {
  const userID = request.params.id;
  const updatedData = request.body;

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
      return users[index];
    } else {
      return { error: "User not found" };
    }
  } catch (error) {
    return { error: "Internal Server Error" };
  }
});

// Run the server!
const runServer = async () => {
  try {
    fastify.listen({ port });
  } catch (err) {
    fastify.log.error(err);
    process.exit(1);
  }
};

runServer();