const express = require('express');
const cors = require('cors');
const axios = require('axios');
const dotenv = require('dotenv');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

const SHOPIFY_STORE_URL = process.env.SHOPIFY_STORE_URL;
const SHOPIFY_ACCESS_TOKEN = process.env.SHOPIFY_ACCESS_TOKEN;
const API_VERSION = '2024-01';

const shopifyClient = axios.create({
    baseURL: `https://${SHOPIFY_STORE_URL}/admin/api/${API_VERSION}`,
    headers: {
        'Content-Type': 'application/json',
        'X-Shopify-Access-Token': SHOPIFY_ACCESS_TOKEN
    }
});

const handleError = (res, error) => {
    console.error('Shopify API Error:', error.response ? error.response.data : error.message);
    res.status(500).json({ error: 'Failed to fetch data from Shopify' });
};

app.get('/api/products', async (req, res) => {
    try {
        const response = await shopifyClient.get('/products.json?limit=50');
        const products = response.data.products.map(p => ({
            id: p.id,
            name: p.title,
            price: p.variants[0]?.price,
            image: p.image?.src || '',
            type: 'product'
        }));
        res.json(products);
    } catch (error) {
        handleError(res, error);
    }
});

app.get('/api/variants', async (req, res) => {
    try {
        const response = await shopifyClient.get('/products.json?limit=50');
        const variants = [];

        response.data.products.forEach(product => {
            product.variants.forEach(variant => {
                variants.push({
                    id: variant.id,
                    name: `${product.title} - ${variant.title}`,
                    product: product.title,
                    price: variant.price,
                    type: 'variant'
                });
            });
        });

        res.json(variants);
    } catch (error) {
        handleError(res, error);
    }
});

app.get('/api/collections', async (req, res) => {
    try {
        const [customRes, smartRes] = await Promise.all([
            shopifyClient.get('/custom_collections.json?limit=25'),
            shopifyClient.get('/smart_collections.json?limit=25')
        ]);

        const collections = [
            ...customRes.data.custom_collections,
            ...smartRes.data.smart_collections
        ].map(c => ({
            id: c.id,
            name: c.title,
            type: 'collection',
            image: c.image?.src
        }));

        res.json(collections);
    } catch (error) {
        handleError(res, error);
    }
});

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});

