import http from "http";
import os from "os";
import fs from "node:fs/promises";
import EventEmitter from "node:events";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// --------------------------------------------------------------------------
// Event Emitter Setup
// --------------------------------------------------------------------------
const myEmitter = new EventEmitter();

myEmitter.on("userCreated", (user) => {
  console.log(`[EVENT] New user registered: ${user.name} (${user.email})`);
});

myEmitter.on("userDeleted", (id) => {
  console.log(`[EVENT] User with ID ${id} deleted.`);
});

// --------------------------------------------------------------------------
// File Handling with userData.json
// --------------------------------------------------------------------------
const filePath = path.join(__dirname, "userData.json");

async function createFile(data) {
  try {
    await fs.writeFile(filePath, JSON.stringify(data, null, 2), "utf8");
    console.log("userData.json updated successfully");
  } catch (err) {
    console.error("Error writing userData.json:", err);
  }
}

async function readFile() {
  try {
    const content = await fs.readFile(filePath, "utf8");
    const data = JSON.parse(content);
    return data;
  } catch (err) {
    console.warn("Error reading userData.json or file empty, using fallback:", err.message);
    return [];
  }
}

// --------------------------------------------------------------------------
// Static File Mime Types
// --------------------------------------------------------------------------
const MIME_TYPES = {
  ".html": "text/html; charset=UTF-8",
  ".css": "text/css; charset=UTF-8",
  ".js": "application/javascript; charset=UTF-8",
  ".json": "application/json; charset=UTF-8",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".svg": "image/svg+xml",
  ".webp": "image/webp",
  ".ico": "image/x-icon",
  ".woff2": "font/woff2",
  ".woff": "font/woff",
  ".ttf": "font/ttf"
};

async function serveStaticFile(req, res, reqUrl) {
  try {
    let cleanPath = reqUrl.split("?")[0].split("#")[0];
    if (cleanPath === "/" || cleanPath === "") {
      cleanPath = "/index.html";
    }

    const safePath = path.normalize(cleanPath).replace(/^(\.\.[\/\\])+/, "");
    const targetFile = path.join(__dirname, safePath);

    // Prevent directory traversal
    if (!targetFile.startsWith(__dirname)) {
      res.statusCode = 403;
      res.setHeader("Content-Type", "text/plain");
      res.end("Forbidden");
      return;
    }

    const stat = await fs.stat(targetFile);
    if (stat.isDirectory()) {
      const indexFile = path.join(targetFile, "index.html");
      const content = await fs.readFile(indexFile);
      res.statusCode = 200;
      res.setHeader("Content-Type", "text/html; charset=UTF-8");
      res.end(content);
      return;
    }

    const ext = path.extname(targetFile).toLowerCase();
    const contentType = MIME_TYPES[ext] || "application/octet-stream";
    const content = await fs.readFile(targetFile);

    res.statusCode = 200;
    res.setHeader("Content-Type", contentType);
    res.end(content);
  } catch (err) {
    // If not found as static asset, return 404
    res.statusCode = 404;
    res.setHeader("Content-Type", "text/plain");
    res.end("Route Not Found");
  }
}

// --------------------------------------------------------------------------
// Server Initialization & Request Router
// --------------------------------------------------------------------------
async function run() {
  try {
    await fs.access(filePath);
  } catch {
    await createFile([
      { id: 1, name: "Akshat", email: "akshat@dimension.com", role: "Master Explorer", memberSince: "Jan 2026", destinations: 18 },
      { id: 2, name: "Akarsh", email: "akarsh@dimension.com", role: "Abyssal Diver", memberSince: "Feb 2026", destinations: 14 },
      { id: 3, name: "Arsh", email: "arsh@dimension.com", role: "Quantum Scout", memberSince: "Mar 2026", destinations: 9 },
      { id: 4, name: "Ashwani", email: "ashwani@dimension.com", role: "Chrono Wanderer", memberSince: "Apr 2026", destinations: 22 }
    ]);
  }

  const server = http.createServer(async (req, res) => {
    const url = req.url;
    const method = req.method;

    // CORS Headers for Cross-Origin / Postman / Cloud clients
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type");

    if (method === "OPTIONS") {
      res.statusCode = 204;
      res.end();
      return;
    }

    // ------------------------------------------------------------------------
    // API ROUTES
    // ------------------------------------------------------------------------
    
    // GET /msg
    if (url === "/msg" && method === "GET") {
      res.statusCode = 200;
      res.setHeader("Content-Type", "text/plain");
      res.end("Welcome to backend");
      return;
    }
    
    // GET /sys
    if (url === "/sys" && method === "GET") {
      res.statusCode = 200;
      res.setHeader("Content-Type", "application/json");
      const sysInfo = {
        platform: os.platform(),
        uptime: os.uptime(),
      };
      res.end(JSON.stringify(sysInfo));
      return;
    }

    // GET /employee OR GET /user OR GET /userData
    if ((url === "/employee" || url === "/user" || url === "/userData") && method === "GET") {
      res.statusCode = 200;
      res.setHeader("Content-Type", "application/json");
      const users = await readFile();
      res.end(JSON.stringify(users));
      return;
    }

    // GET /userData/:id OR GET /user/:id
    if ((url.startsWith("/userData/") || url.startsWith("/user/")) && method === "GET") {
      const parts = url.split("/");
      const id = Number(parts[2]);
      const users = await readFile();
      const user = users.find((u) => u.id === id);
      res.setHeader("Content-Type", "application/json");
      if (user) {
        res.statusCode = 200;
        res.end(JSON.stringify(user));
      } else {
        res.statusCode = 404;
        res.end(JSON.stringify({ message: "User not found" }));
      }
      return;
    }

    // POST /create OR POST /user OR POST /registered
    if ((url === "/create" || url === "/user" || url === "/registered") && method === "POST") {
      let body = "";

      req.on("data", (chunk) => {
        body += chunk.toString();
      });

      req.on("end", async () => {
        try {
          const incomingData = JSON.parse(body);
          const users = await readFile();

          const maxId = users.reduce((max, u) => Math.max(max, u.id || 0), 0);
          const newUser = {
            id: incomingData.id || maxId + 1,
            name: incomingData.name || "Explorer",
            email: incomingData.email || "",
            role: incomingData.role || "Dimension Traveler",
            memberSince: incomingData.memberSince || "September 2026",
            destinations: incomingData.destinations || Math.floor(Math.random() * 15) + 5
          };

          users.push(newUser);
          await createFile(users);

          myEmitter.emit("userCreated", newUser);

          res.statusCode = 201;
          res.setHeader("Content-Type", "application/json");
          res.end(
            JSON.stringify({
              message: "User added successfully",
              user: newUser,
            })
          );
        } catch (err) {
          res.statusCode = 400;
          res.setHeader("Content-Type", "application/json");
          res.end(JSON.stringify({ message: "Invalid JSON" }));
        }
      });
      return;
    }

    // DELETE /delete/:id OR DELETE /user/:id
    if ((url.startsWith("/delete/") || url.startsWith("/user/")) && method === "DELETE") {
      const parts = url.split("/");
      const id = Number(parts[2]);
      const users = await readFile();
      const index = users.findIndex((u) => u.id === id);

      res.setHeader("Content-Type", "application/json");

      if (index === -1) {
        res.statusCode = 404;
        res.end(JSON.stringify({ message: "User not found" }));
        return;
      }

      const deletedUser = users.splice(index, 1)[0];
      await createFile(users);

      myEmitter.emit("userDeleted", id);

      res.statusCode = 200;
      res.end(
        JSON.stringify({
          message: "User deleted successfully",
          user: deletedUser,
        })
      );
      return;
    }

    // PUT /edit/:id OR PUT /user/:id
    if ((url.startsWith("/edit/") || url.startsWith("/user/")) && method === "PUT") {
      const parts = url.split("/");
      const id = Number(parts[2]);
      let body = "";

      req.on("data", (chunk) => {
        body += chunk.toString();
      });

      req.on("end", async () => {
        try {
          const updatedData = JSON.parse(body);
          const users = await readFile();
          const user = users.find((u) => u.id === id);

          res.setHeader("Content-Type", "application/json");

          if (!user) {
            res.statusCode = 404;
            res.end(JSON.stringify({ message: "User not found" }));
            return;
          }

          if (updatedData.name || updatedData.Name) user.name = updatedData.name || updatedData.Name;
          if (updatedData.email || updatedData.Email) user.email = updatedData.email || updatedData.Email;
          if (updatedData.role || updatedData.Role) user.role = updatedData.role || updatedData.Role;

          await createFile(users);

          res.statusCode = 200;
          res.end(
            JSON.stringify({
              message: "User updated successfully",
              user: user,
            })
          );
        } catch (err) {
          res.statusCode = 400;
          res.setHeader("Content-Type", "application/json");
          res.end(JSON.stringify({ message: "Invalid JSON" }));
        }
      });
      return;
    }

    // ------------------------------------------------------------------------
    // STATIC FRONTEND ASSET SERVING (Landing Page, CSS, JS, Images)
    // ------------------------------------------------------------------------
    if (method === "GET") {
      await serveStaticFile(req, res, url);
      return;
    }

    // Unhandled non-GET route
    res.statusCode = 404;
    res.setHeader("Content-Type", "text/plain");
    res.end("Route Not Found");
  });

  const PORT = process.env.PORT || 3001;
  server.listen(PORT, () => {
    console.log(`AVS Server is running on port ${PORT}`);
  });
}

run();
