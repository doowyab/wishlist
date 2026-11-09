import { createClient } from "@neon/neon-js";

// Public endpoints for the Neon "wishlist" project (production branch).
// These are not secrets; override with VITE_NEON_AUTH_URL / VITE_NEON_DATA_API_URL if needed.
const AUTH_URL =
    import.meta.env.VITE_NEON_AUTH_URL ??
    "https://ep-old-shape-zalxh49e.neonauth.c-2.eu-west-2.aws.neon.tech/neondb/auth";
const DATA_API_URL =
    import.meta.env.VITE_NEON_DATA_API_URL ??
    "https://ep-old-shape-zalxh49e.apirest.c-2.eu-west-2.aws.neon.tech/neondb/rest/v1";

// db.auth is the Neon Auth (Better Auth) client; db.from()/db.rpc() query the Data API.
// allowAnonymous lets signed-out guests read lists and record purchases.
export const db = createClient({
    auth: { url: AUTH_URL, allowAnonymous: true },
    dataApi: { url: DATA_API_URL },
});
