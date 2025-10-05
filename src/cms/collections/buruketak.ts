import type { CollectionConfig, CollectionAfterReadHook } from 'payload';

const hideCorrectAnswerForNonAdmins: CollectionAfterReadHook = ({ doc, req }) => {
    // Hide correct answer for api consumers
    const isAdminUI = !!req.user;
    if (!isAdminUI) {
        if (doc && typeof doc === 'object' && 'erantzun_zuzena' in doc) {
            return { ...doc, erantzun_zuzena: undefined };
        }
    }
    return doc;
};

const Buruketak: CollectionConfig = {
    slug: 'buruketak',
    labels: { singular: 'Buruketa', plural: 'Buruketak' },
    admin: {
        useAsTitle: 'buruketa',
        defaultColumns: ['gaia', 'zailtasuna', 'buruketa', 'updatedAt'],
        group: 'Edukiak',
    },
    access: {
        read: () => true,
        create: ({ req }) => !!req.user,
        update: ({ req }) => !!req.user,
        delete: ({ req }) => !!req.user,
    },
    hooks: {
        afterRead: [hideCorrectAnswerForNonAdmins],
    },
    fields: [
        {
            name: 'gaia',
            label: 'Gaia',
            type: 'relationship',
            relationTo: 'gaiak',
            required: true,
            admin: { position: 'sidebar' },
        },
        {
            name: 'zailtasuna',
            label: 'Zailtasuna',
            type: 'select',
            required: true,
            options: [
                { label: 'Erraza', value: 'erraza' },
                { label: 'Ertaina', value: 'ertaina' },
                { label: 'Zaila', value: 'zaila' },
            ],
            admin: { position: 'sidebar' },
        },
        {
            name: 'buruketa',
            label: 'Buruketa (Buruketaren deskribapena)',
            type: 'textarea',
            required: true,
        },
        {
            name: 'erantzun_zuzena',
            label: 'Erantzun zuzena (Zenbakia izan behar du)',
            type: 'number',
            required: true,
        },
        {
            name: 'azalpena',
            label: 'Azalpena (Kontextu gehiago, beharko balitz (etorkizunien ikasliek aukeratzie zaek laguntza gehio ber aldun)',
            type: 'textarea',
        },
        {
            name: 'iturburua',
            label: 'Iturburua (IA edo Eskuz egina, IMPLEMENTATU GABE)',
            type: 'select',
            defaultValue: 'manual',
            options: [
                { label: 'Manual', value: 'manual' },
                { label: 'IA', value: 'ai' },
            ],
            admin: { position: 'sidebar' },
        },
        // TODO: for future, approval required
        // {
        //     name: 'status',
        //     label: 'Egoera (Estado)',
        //     type: 'select',
        //     defaultValue: 'draft',
        //     options: [
        //         { label: 'Borrador', value: 'draft' },
        //         { label: 'Publicado', value: 'published' },
        //         { label: 'Archivado', value: 'archived' },
        //     ],
        //     admin: { position: 'sidebar' },
        // },
    ],
    timestamps: true,
};

export default Buruketak;