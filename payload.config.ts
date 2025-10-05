// storage-adapter-import-placeholder
import path from 'path';
import { fileURLToPath } from 'url';

import { postgresAdapter } from '@payloadcms/db-postgres';
// import { resendAdapter } from '@payloadcms/email-resend';
// import { payloadCloudPlugin } from '@payloadcms/payload-cloud';
import { lexicalEditor } from '@payloadcms/richtext-lexical';
import { buildConfig } from 'payload';
import sharp from 'sharp';
import Admins from "@/cms/collections/admins";
import Students from "@/cms/collections/students";


const filename = fileURLToPath(import.meta.url);
const dirname = path.dirname(filename);

export default buildConfig({
    admin: {
        user: Admins.slug,
        importMap: {
            baseDir: path.resolve(dirname),
        },
    },
    routes: {
        admin: '/admin',
        api: '/api/payload',
    },
    collections: [
        Admins,
        Students
    ],
    editor: lexicalEditor(),
    secret: process.env.PAYLOAD_SECRET!,
    typescript: {
        outputFile: path.resolve(dirname, 'payload-types.ts'),
    },
    graphQL: {
        disable: true,
    },
    db: postgresAdapter({
        pool: {
            connectionString: process.env.DATABASE_URL,
        },
        migrationDir: path.resolve(dirname, 'migrations'),
    }),
    // email: resendAdapter({
    //     defaultFromAddress: env.EMAIL_FROM_ADDRESS,
    //     defaultFromName: env.EMAIL_FROM_NAME,
    //     apiKey: env.EMAIL_RESEND_API_KEY,
    // }),
    sharp,
    plugins: [
        // payloadCloudPlugin(),
        // storage-adapter-placeholder
    ],
});

