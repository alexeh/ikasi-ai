// payload.config.ts
import path from "path";
import { buildConfig } from "payload";
import { postgresAdapter } from "@payloadcms/db-postgres";
import { lexicalEditor } from "@payloadcms/richtext-lexical";

export default buildConfig({

    // serverURL: process.env.NEXT_PUBLIC_APP_URL,

    secret: process.env.PAYLOAD_SECRET!,

    admin: {
        user: "users",
    },

    editor: lexicalEditor(),

    collections: [
        {
            slug: "users",
            auth: true,
            fields: [

                { name: "name", type: "text", required: false },

            ],
        },

    ],



    db: postgresAdapter({

        pool: {
            connectionString: process.env.DATABASE_URL!,

        },
    }),


    typescript: {
        outputFile: path.resolve(process.cwd(), "payload-types.ts"),
    },

});