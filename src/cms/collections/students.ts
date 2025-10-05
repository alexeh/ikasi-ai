// src/collections/students.ts
import type { CollectionConfig } from 'payload'

const Students: CollectionConfig = {
    slug: 'students',
    auth: true,
    access: {
        read: ({ req }) => Boolean(req.user),
        create: () => true,
        update: ({ req }) => Boolean(req.user),
        delete: ({ req }) => Boolean(req.user),
    },
    fields: [
        { name: 'name', type: 'text', required: true },
        { name: 'age', type: 'number', required: false },
        { name: 'email', type: 'email', required: true, unique: true },
        { name: 'class', type: 'text', required: false },
        { name: 'school', type: 'text', required: false },
    ],
}

export default Students