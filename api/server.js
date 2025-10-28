const express = require('express');
const cors = require('cors');
const app = express();
app.use(cors());
app.use(express.json());

const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

app.post('/create-checkout-session', async (req, res) => {
    try {
        const { items, customerEmail } = req.body;
        const session = await stripe.checkout.sessions.create({
            mode: 'payment',
            line_items: items,
            customer_email: customerEmail || undefined,
            success_url: process.env.SUCCESS_URL,
            cancel_url: process.env.CANCEL_URL,
        });
        res.json({ url: session.url, id: session.id });
    } catch (e) {
        console.error(e);
        res.status(400).json({ error: e.message });
    }
});

app.listen(4242, () => console.log('Stripe API on :4242'));