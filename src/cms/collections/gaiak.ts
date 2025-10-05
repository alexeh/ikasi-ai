import type { CollectionConfig } from 'payload';

const Gaiak: CollectionConfig = {
    slug: 'gaiak',
    labels: { singular: 'Gaia', plural: 'Gaiak' },
    admin: {
        useAsTitle: 'gaia',
        defaultColumns: ['izena', 'slug', 'createdAt'],
    },
    access: {
        read: () => true,
        create: ({ req }) => !!req.user,
        update: ({ req }) => !!req.user,
        delete: ({ req }) => !!req.user,
    },
    fields: [
        {
            name: 'gaia',
            label: 'Buruketaren gaia',
            type: 'text',
            required: true,
            unique: true,
        },
        {
            name: 'slug',
            type: 'text',
            required: true,
            unique: true,
            admin: { description: 'URL-rako identifikatzailea (espaziorik gabe, minuskulak, etc...' },
        },
        {
            name: 'deskribapena',
            label: 'Gaiaren deskribapena',
            type: 'textarea',
        },
    ],
    timestamps: false,
};

export default Gaiak;