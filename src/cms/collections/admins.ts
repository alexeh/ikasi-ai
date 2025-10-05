
import type { CollectionConfig } from 'payload'

const Admins: CollectionConfig = {
    slug: 'admins',
    auth: true,
    admin: { useAsTitle: 'email' },
    access: {
        read: ({ req }) => Boolean(req.user),
        create: () => true,          // bootstrapping
        update: ({ req }) => Boolean(req.user),
        delete: ({ req }) => Boolean(req.user),
    },
    fields: [
        { name: 'name', type: 'text' },
    ],
}

export default Admins