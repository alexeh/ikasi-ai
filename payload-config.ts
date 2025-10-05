// payload.config.ts
import path from "path";
import { buildConfig } from "payload";
import { postgresAdapter } from "@payloadcms/db-postgres";
import { lexicalEditor } from "@payloadcms/richtext-lexical";

export default buildConfig({
    // URL pública de tu app (opcional, útil para emails/links)
    serverURL: process.env.NEXT_PUBLIC_APP_URL,

    // Necesario para sesiones / JWT
    secret: process.env.PAYLOAD_SECRET!,

    // Indica qué colección usa el Admin para autenticación
    admin: {
        user: "users",
    },

    // Editor moderno (si no usas richtext, puedes quitarlo)
    editor: lexicalEditor(),

    // Colecciones mínimas
    collections: [
        {
            slug: "users",
            auth: true,              // <-- habilita login
            fields: [
                // Email y password los pone Payload automáticamente al usar auth:true
                { name: "name", type: "text", required: false },
                // añade más campos si quieres
            ],
        },
        // añade tus otras colecciones aquí...
    ],

    // Base de datos Postgres
    db: postgresAdapter({
        // Puedes pasar opciones de pg.Pool aquí
        pool: {
            connectionString: process.env.DATABASE_URL!, // formato: postgres://USER:PASS@HOST:5432/DB
            // ssl: { rejectUnauthorized: false }, // si tu proveedor lo requiere
        },
    }),

    // Generación de tipos (útil para importar en el código)
    typescript: {
        outputFile: path.resolve(process.cwd(), "payload-types.ts"),
    },

    // CORS/CSRF si tu frontend vive en otro dominio
    // cors: [process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:9002"],
    // csrf: [process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:9002"],
});