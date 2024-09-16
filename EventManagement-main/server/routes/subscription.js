const express = require('express');
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const User = require('../models/User');

const router = express.Router();

router.post('/create-s', async (req, res) => {
  try {
    const { userId, paymentMethodId, priceId } = req.body;
    
    // Retrieve the user and their Stripe customer ID
    const user = await User.findById(userId);
    const customerId = user.stripeCustomerId;

    // Attach the payment method to the customer
    await stripe.paymentMethods.attach(paymentMethodId, { customer: customerId });

    // Set the default payment method on the customer
    await stripe.customers.update(customerId, { 
      invoice_settings: { default_payment_method: paymentMethodId },
    });

    // Create the subscription
    const subscription = await stripe.subscriptions.create({
      customer: customerId,
      items: [{ price: priceId }],
      expand: ['latest_invoice.payment_intent'],
    });

    user.subscriptionId = subscription.id; // Save subscription ID to user in your DB
    await user.save();

    res.status(201).send(subscription);
  } catch (error) {
    res.status(400).send(error.message);
  }
});

module.exports = router;

  