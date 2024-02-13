import { LogMessage } from "../modules/General.mjs";

/**
 * Loads users from the "./users.json" file and places them inside "res.locals.users".
 * @param {object} req - The request object.
 * @param {object} res - The response object.
 * @returns {object} The list of users, stored in "res.locals.users".
 */
export async function LoadUsers(req, res) {
    // Specify which pages should run this middleware
    if (req.url === "/" || req.url === "/login") {
        try {
            // Import JSON file
            res.locals.users = (await import("../users.json", { assert: { type: "json" }})).default;
        } catch (error) {
            LogMessage("Failed to load users.");
            res.locals.users = [];
        }
    }
}
