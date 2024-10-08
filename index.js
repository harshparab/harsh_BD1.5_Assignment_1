const express = require('express');
const { resolve } = require('path');
let cors = require('cors');

const app = express();
app.use(cors());

const port = 3000;

let taxRate = 5;
let discountPercentage = 10;
let loyaltyRate = 2;

app.get('/cart-total', (req, res) => {
  let newItemPrice = parseFloat(req.query.newItemPrice);
  let cartTotal = parseFloat(req.query.cartTotal);
  res.send((newItemPrice + cartTotal).toString());
});

function returnDiscountedAmount(amount, isMember) {
  if (isMember) {
    return amount - (amount * discountPercentage) / 100;
  } else {
    return amount;
  }
}

app.get('/membership-discount', (req, res) => {
  let cartTotal = parseFloat(req.query.cartTotal);
  let isMember = req.query.isMember === 'true';

  res.send(returnDiscountedAmount(cartTotal, isMember).toString());
});

function calculateTax(amount) {
  return (amount * taxRate) / 100;
}

app.get('/calculate-tax', (req, res) => {
  let cartTotal = parseFloat(req.query.cartTotal);

  res.send(calculateTax(cartTotal).toString());
});

function estimateTimeTakenForDelivery(shippingMethod, distance) {
  let shippingTime;
  if (shippingMethod == 'standard') {
    shippingTime = distance / 50;
  } else if (shippingMethod == 'express') {
    shippingTime = distance / 100;
  } else {
    shippingTime = `Invalid delivery method`;
  }
  return shippingTime.toString();
}

app.get('/estimate-delivery', (req, res) => {
  let shippingMethod = req.query.shippingMethod;
  let distance = parseFloat(req.query.distance);

  res.send(estimateTimeTakenForDelivery(shippingMethod, distance));
});

app.get('/shipping-cost', (req, res) => {
  let weight = parseFloat(req.query.weight);
  let distance = parseFloat(req.query.distance);

  res.send((weight * distance * 0.1).toString());
});

app.get('/loyalty-points', (req, res) => {
  let purchaseAmount = parseFloat(req.query.purchaseAmount);

  res.send((purchaseAmount * loyaltyRate).toString());
});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
