import http from "http";
import fs from "fs";
import path from "path";
import { SecurityHeaders } from "./middleware/SecurityHeaders.mjs";
import { LoadUsers } from "./middleware/LoadUsers.mjs";
import { ValidateEmailAddress, ValidatePassword, LogMessage } from "./modules/General.mjs"

const server = http.createServer(async (req, res) => {
    res.locals = {};

    // Run middlewares
    SecurityHeaders(req, res);
    LoadUsers(req, res);

    if (req.url === "/" && req.method === "GET") {
        /**
         * ===== START PAGE (HTML + CSS + JavaScript) =====
         */
        try {
            fs.readFile("./index.html", (err, data) => {
                if (err) {
                    res.writeHead(500, { "Content-Type": "text/plain" });
                    return res.end("Internal Server Error");
                }

                // Replace "{{ value }}" with "res.locals.<value>" in the HTML body
                const html = data.toString().replace(/{{\s*([^{}\s]+)\s*}}/g, (match, group) => res.locals[group]);
                const contentLength = Buffer.byteLength(html, "utf8");

                // Serve the page to the client
                res.writeHead(200, { "Content-Type": "text/html", "Content-Length": contentLength });
                res.write(html);
                return res.end();
            });
        } catch (error) {
            LogMessage("Failed to serve Start page.");
            res.writeHead(500, { "Content-Type": "text/plain" });
            return res.end("Internal Server Error");
        }
    } else if (req.url === "/api" && req.method === "GET") {
        /**
         * ===== API PAGE (JSON) =====
         */
        try {
            // Import JSON file
            const data = (await import("./cities.json", { assert: { type: "json" }})).default;

            // Serve the JSON data to the client
            res.writeHead(200, { "Content-Type": "application/json" });
            res.write(JSON.stringify(data));
            return res.end();
        } catch (error) {
            LogMessage("Failed to serve JSON data.");
            res.writeHead(500, { "Content-Type": "application/json" });
            return res.end(JSON.stringify({ message: "Internal Server Error" }));
        }
    } else if (req.url === "/about" && req.method === "GET") {
        /**
         * ===== ABOUT PAGE (HTML) =====
         */
        try {
            fs.readFile("./about.html", (err, data) => {
                if (err) {
                    res.writeHead(500, { "Content-Type": "text/plain" });
                    return res.end("Internal Server Error");
                }

                // Serve the page to the client
                res.writeHead(200, { "Content-Type": "text/html", "Content-Length": data.length });
                res.write(data);
                return res.end();
            });
        } catch (error) {
            LogMessage("Failed to serve About page.");
            res.writeHead(500, { "Content-Type": "text/plain" });
            return res.end("Internal Server Error");
        }

    } else if (req.url === "/login" && req.method === "POST") {
        /**
         * ===== LOGIN FORM =====
         */
        try {
            // Construct request body
            let body = "";
            req.on("data", (chunk) => { body += chunk.toString(); });

            // Process request body
            req.on("end", () => {
                // Get form values
                const formData = JSON.parse(body);
                const email = formData.email.trim().toLocaleLowerCase();
                const password = formData.password.trim();

                // Set response header to JSON
                res.writeHead(200, { "Content-Type": "application/json" });

                // Validate email address and password format
                if (!ValidateEmailAddress(email) || !ValidatePassword(password)) {
                    return res.end(JSON.stringify({ success: false, message: "Invalid email/password format." }));
                }

                // Search for a user with the given email address
                const user = res.locals.users.find(user => user.email === email);
                if (!user) {
                    return res.end(JSON.stringify({ success: false, message: "A user with that email address does not exist." }));
                }

                // Validate the password of the user
                if (user.password !== password) {
                    return res.end(JSON.stringify({ success: false, message: "Incorrect password." }));
                }

                // Login was successful, send a response to the client
                fs.readFile("./admin.html", "utf8", (err, data) => {
                    if (err || !user.admin) {
                        return res.end(JSON.stringify({ success: false, message: "You don't have access to the admin panel." }));
                    }

                    return res.end(JSON.stringify({ success: true, fragment: data }));
                });
            });
        } catch (error) {
            LogMessage("Failed to handle Login Form request.");
            res.writeHead(500, { "Content-Type": "application/json" });
            return res.end("Internal Server Error");
        }
    } else {
        try {
            /**
             * Serve static files
             */

            // Get the end of the URL
            const slug = req.url.replace(/^\/+|\/+$/g, "");

            // Get the file extension and file reference
            const extension = path.extname(slug);
            const file = "./public/" + slug;

            // Read the file
            fs.readFile(file, (err, data) => {
                // Local File Inclusion (LFI) exploit mitigation
                // Prevents path traversal
                if (err || slug.search(/\.\./) !== -1) {
                    res.writeHead(404, { "Content-Type": "text/plain" });
                    return res.end("Not Found");
                }

                // Set content type based on the file extension
                switch (extension) {
                    case ".css":
                        res.writeHead(200, { "Content-Type": "text/css" });
                        break;
                    case ".js":
                        res.writeHead(200, { "Content-Type": "application/javascript" });
                        break;
                    case ".json":
                        res.writeHead(200, { "Content-Type": "application/json" });
                        break;
                    case ".ico":
                        res.writeHead(200, { "Content-Type": "image/x-icon" });
                        break;
                    case ".svg":
                        res.writeHead(200, { "Content-Type": "image/svg+xml" });
                        break;
                    case ".png":
                        res.writeHead(200, { "Content-Type": "image/png" });
                        break;
                    case ".jpg":
                        res.writeHead(200, { "Content-Type": "image/jpeg" });
                        break;
                    case ".jpeg":
                        res.writeHead(200, { "Content-Type": "image/jpeg" });
                        break;
                    case ".webp":
                        res.writeHead(200, { "Content-Type": "image/webp" });
                        break;
                    case ".avif":
                        res.writeHead(200, { "Content-Type": "image/avif" });
                        break;
                    case ".woff2":
                        res.writeHead(200, { "Content-Type": "font/woff2" });
                        break;
                    default:
                        res.writeHead(400);
                        break;
                }

                // Serve the file to the client
                return res.end(data);
            });
        } catch (error) {
            res.writeHead(404, { "Content-Type": "text/plain" });
            return res.end("Not Found");
        }
    }
});

// Start the web server
server.listen(3000, () => {
    LogMessage(`The web server is running at: http://127.0.0.1:3000/`);
});