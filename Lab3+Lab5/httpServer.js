import http from "http";
import os from "os";
import fs from "node:fs/promises";

const filePath = "userData.json";

async function createFile(data) {
  try {
    await fs.writeFile(filePath, JSON.stringify(data, null, 2), "utf8");

    console.log("File created successfully");
  } catch (err) {
    console.log(err);
  }
}

async function readFile() {
  try {
    const content = await fs.readFile(filePath, "utf8");
    const data = JSON.parse(content);

    return data;
  } catch (err) {
    console.log(err);
    return [];
  }
}
async function run() {
  try {
    await fs.access(filePath);
  } catch {
    await createFile([]);
  }
  const server = http.createServer(async (req, res) => {
    const url = req.url;
    const method = req.method;

    // GET /msg
    if (url === "/msg" && method === "GET") {
      res.statusCode = 200;
      res.setHeader("Content-Type", "text/plain");

      res.end("Hello World");
    }
    // GET /sys
    else if (url === "/sys" && method === "GET") {
      res.statusCode = 200;
      res.setHeader("Content-Type", "application/json");

      const sysInfo = {
        platform: os.platform(),
        uptime: os.uptime(),
      };

      res.end(JSON.stringify(sysInfo));
    }
    // GET /employee
    else if (url === "/employee" && method === "GET") {
      res.statusCode = 200;
      res.setHeader("Content-Type", "application/json");

      const employees = await readFile();

      res.end(JSON.stringify(employees));
    }
    // GET /userData/:id
    else if (url.startsWith("/userData/") && method === "GET") {
      const id = Number(url.split("/")[2]);
      const users = await readFile();
      const user = users.find((user) => user.id === id);
      res.setHeader("Content-Type", "application/json");
      if (user) {
        res.statusCode = 200;

        res.end(JSON.stringify(user));
      } else {
        res.statusCode = 404;

        res.end(
          JSON.stringify({
            message: "User not found",
          }),
        );
      }
    }
    //Delete
    else if (url.startsWith("/delete/") && method === "DELETE") {
      const id = Number(url.split("/")[2]);

      const users = await readFile();

      const index = users.findIndex((user) => user.id === id);

      res.setHeader("Content-Type", "application/json");

      if (index === -1) {
        res.statusCode = 404;
        res.end(
          JSON.stringify({
            message: "User not found",
          }),
        );

        return;
      }

      const deletedUser = users.splice(index, 1);

      await createFile(users);

      res.statusCode = 200;

      res.end(
        JSON.stringify({
          message: "User deleted successfully",
          user: deletedUser,
        }),
      );
    }

    // POST /create
    else if (url === "/create" && method === "POST") {
      let body = "";

      req.on("data", (chunk) => {
        body += chunk.toString();
      });

      req.on("end", async () => {
        try {
          const user = JSON.parse(body);

          const array = await readFile();

          array.push(user);

          await createFile(array);

          res.statusCode = 201;
          res.setHeader("Content-Type", "application/json");

          res.end(
            JSON.stringify({
              message: "User added successfully",
              user: user,
            }),
          );

          console.log(array);
        } catch (err) {
          res.statusCode = 400;
          res.setHeader("Content-Type", "application/json");

          res.end(
            JSON.stringify({
              message: "Invalid JSON",
            }),
          );
        }
      });
    }
    // PUT /edit
    else if (url.startsWith("/edit/") && method === "PUT") {
      const id = url.split("/")[2];

      let body = "";

      req.on("data", (chunk) => {
        body += chunk.toString();
      });

      req.on("end", async () => {
        try {
          const updatedData = JSON.parse(body);

          const users = await readFile();

          const user = users.find((user) => user.id === id);

          res.setHeader("Content-Type", "application/json");

          if (!user) {
            res.statusCode = 404;
            res.end(
              JSON.stringify({
                message: "User not found",
              }),
            );
            return;
          }

          user.Name = updatedData.Name;
          user.Role = updatedData.Role;

          await createFile(users);

          res.statusCode = 200;
          res.end(
            JSON.stringify({
              message: "User updated successfully",
              user: user,
            }),
          );
        } catch (err) {
          res.statusCode = 400;
          res.end(
            JSON.stringify({
              message: "Invalid JSON",
            }),
          );
        }
      });
    }
    // Route Not Found
    else {
      res.statusCode = 404;
      res.setHeader("Content-Type", "text/plain");

      res.end("Route Not Found");
    }
  });

  const port = 3001;

  server.listen(port, () => {
    console.log(`Server is running on port: ${port}`);
  });
}

run();


// import http from "http";

// const array = [
//     {
//         id: 1,
//         name: "Akarsh",
//         age: 20
//     },
//     {
//         id: 2,
//         name: "Akshat",
//         age: 21
//     },
//     {
//         id: 3,
//         name: "Ansh",
//         age: 17
//     }
// ];
// const PORT = 8080;

// const app = http.createServer((req, res) => {
//     const url = req.url;
//     const method = req.method;

//     if (url === "/msg" && method === "GET") {
//         res.statusCode = 200;
//         res.setHeader("Content-Type", "text/plain");

//         res.end("Welcome to backend");
//     }
//     else if (url === "/user" && method === "GET") {
//         res.statusCode = 200;
//         res.setHeader("Content-Type", "application/json");

//         res.end(JSON.stringify(array));
//     }
//     else if (url === "/user" && method === "POST") {
//         let body = "";
//         req.on("data", (chunk) => {
//             body += chunk.toString();
//         });

//         req.on("end", () => {
//             const user = JSON.parse(body);

//             array.push(user);

//             res.statusCode = 201;
//             res.setHeader("Content-Type", "application/json");

//             res.end(JSON.stringify({
//                 message: "User added successfully",
//                 user: user
//             }));
//             console.log(array)
//         });
//     }
//     else {
//         res.statusCode = 404;
//         res.setHeader("Content-Type", "text/plain");

//         res.end("Route not found");
//     }

// });

// app.listen(PORT, () => {
//     console.log(`Server is running at http://localhost:${PORT}`);
// });