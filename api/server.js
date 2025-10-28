import express from 'express';
import cors from 'cors';
import Stripe from 'stripe';
import 'dotenv/config';
import { db } from './firebaseAdmin.js';

const app = express();
app.use(cors({ origin: ['http://localhost:5173'], credentials: false }));
app.use(express.json());

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

app.get('/health', (_req, res) => res.json({ status: 'ok' }))

const PRODUCTS = {
    'plasmic-sticker':  { name: 'PLASMIC ステッカー',  unit_amount: 300 * 100 },
    'plasmic-tshirt':   { name: 'PLASMIC Tシャツ',     unit_amount: 2500 * 100 },
    'plasmic-mug':      { name: 'PLASMIC マグカップ',  unit_amount: 1500 * 100 },
}

app.post('/create-checkout-session', async (req, res) => {
    try {
        const session = await stripe.checkout.sessions.create({
            mode: 'payment',
            payment_method_types: ['card'],
            line_items: [{
                price_data: {
                    currency: 'jpy',
                    product_data: {
                        name: 'サンプル商品',
                    },
                    unit_amount: 1000
                },
                quantity: 1
            }],
            success_url: 'http://localhost:5173/success?{session_id={CHECKOUT_SESSION_ID}}',
            cancel_url: 'http://localhost:5173/',
        });
        res.json({ url: session.url });
    } catch (e) {
        res.status(400).json({ error: e.message });
    }
});

app.listen(process.env.PORT || 4242, () => {
    console.log('API on', process.env.PORT || 4242);
});
app.get('/session', async (req, res) => {
    try {
        const { id } = req.query; // cs_test_...
        const s = await stripe.checkout.sessions.retrieve(
            id,
            {
                expand: ['line_items.data.price.product']
            });
        res.json({
            id: s.id,
            amount_total: s.amount_total,
            currency: s.currency,
            customer_email: s.customer_details?.email,
            items: s.line_items?.data
        });
    } catch (e) {
        res.status(400).json({ error: e.message });
    }
});

app.post('/purchases/save', async (req, res) => {
    try {
        const { session_id } = req.body
        if (!session_id) return res.status(400).json({ error: 'session_id required' })

        const s = await stripe.checkout.sessions.retrieve(session_id, {
            expand: ['line_items.data.price.product', 'customer'],
        })

        await db.collection('purchases').doc(s.id).set({
            amount_total: s.amount_total,
            currency: s.currency,
            email: s.customer_details?.email || null,
            created_at: new Date(),
            items: (s.line_items?.data || []).map(i => ({
                name: i.description,
                qty: i.quantity,
                unit: i.price?.unit_amount ?? null,
            })),
        })

        res.json({ ok: true })
    } catch (e) {
        console.error('[purchases/save]', e)
        res.status(400).json({ error: e.message })
    }
})

app.post('/purchases/save', async (req, res) => {
    try {
        const { session_id } = req.body
        if(!session_id) return res.status(400).json({ error: 'session_id is required' })
        const s = await stripe.checkout.sessions.retrieve(session_id, { expand: ['line_items.data.price.product'] });
        await db.collection('purchases').doc(s.id).set({
            amount_total: s.amount_total,
            currency: s.currency,
            created: new Date(),
            email: s.customer_details?.email || null,
            items: (s.line_items?.data || []).map(i => ({
                name: i.description, qty: i.quantity, unit: i.price?.unit_amount
            }))
        });

        res.json({ success: true });
    } catch (e) {
        res.status(400).json({ error: e.message });
    }
})