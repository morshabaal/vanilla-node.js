import crypto from "crypto";

/**
 * Applies security related headers and sends them back to the client.
 * This also generates and applies a nonce, to allow for inline CSS and JavaScript.
 * @param {object} req - The request object.
 * @param {object} res - The response object.
 * @returns {object} The response headers.
 */
export function SecurityHeaders(req, res) {
    // Create and assign a nonce to the response
    // This allows for inline CSS and JavaScript to pass the CSP
    res.locals.nonce = crypto.randomBytes(16).toString("base64");

    // Content Security Policy (CSP)
    res.setHeader("Content-Security-Policy", `default-src 'self'; connect-src 'self'; base-uri 'self'; font-src 'self'; form-action 'self'; frame-ancestors 'none'; frame-src 'self'; img-src 'self' data:; object-src 'none'; script-src 'self' 'nonce-${res.locals.nonce}'; script-src-attr 'none'; style-src 'self' 'nonce-${res.locals.nonce}'`);

    // HTTP Strict Transport Security (HSTS)
    res.setHeader("Strict-Transport-Security", "max-age=31536000; includeSubDomains; preload");

    // Cross Origin Opener Policy (COOP)
    res.setHeader("Cross-Origin-Opener-Policy", "same-origin");

    // Cross Origin Embedder Policy (COEP)
    res.setHeader("Cross-Origin-Embedder-Policy", "require-corp");

    // Cross Origin Resource Policy (CORP)
    res.setHeader("Cross-Origin-Resource-Policy", "same-origin");

    // Origin Agent Cluster header
    res.setHeader("Origin-Agent-Cluster", "?1");

    // Referrer Policy
    res.setHeader("Referrer-Policy", "no-referrer");

    // Frame Options
    res.setHeader("X-Frame-Options", "DENY");

    // XSS Protection (deprecated)
    res.setHeader("X-XSS-Protection", "0");

    // Download Options (deprecated)
    res.setHeader("X-Download-Options", "noopen");

    // Permitted Cross Domain Policies
    res.setHeader("X-Permitted-Cross-Domain-Policies", "none");

    // Content Type Options
    // res.setHeader("X-Content-Type-Options", "nosniff");
}
