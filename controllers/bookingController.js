// const stripe = require('stripe')('sk_test_51Lk0NrHhP5DWLGLpsw1Lr08a39ELI6Se9GB0NqABD5w1FxFKLIASTmWxTaPpdp6F4Fg19RyPGfwmNYCkxzuV2YVk00jIAYLkdE');
const Stripe = require('stripe');
const stripe = Stripe('sk_test_51Lk0NrHhP5DWLGLpsw1Lr08a39ELI6Se9GB0NqABD5w1FxFKLIASTmWxTaPpdp6F4Fg19RyPGfwmNYCkxzuV2YVk00jIAYLkdE');
const Tour = require('../models/tourModel');
// const User = require('../models/userModel');
const Booking = require('../models/bookingModel');
// const Booking = require('../models/bookingModel');
const catchAsync = require('../utils/catchAsync');
const factory = require('./handlerFactory');


exports.getCheckoutSession = catchAsync(async (req, res, next) => {
  // 1) Get the currently booked tour
  const tour = await Tour.findById(req.params.tourId);
  console.log(tour);
    console.log(req.params.tourId)
//   console.log(req.user.id);
//   const user = await User.find(req.user);

  // 2) Create checkout session
  const session = await stripe.checkout.sessions.create({
    payment_method_types: ['card'],
    success_url: `${req.protocol}://${req.get('host')}/?tour=${req.params.tourId}&price=${tour.price}`,
    cancel_url: `${req.protocol}://${req.get('host')}/tour/${tour.slug}`,
    // customer_email: req.user.email,
    client_reference_id: req.params.tourId,
    line_items: [{
        price_data: {
          currency: 'usd',
          product_data: {
            name: `${tour.name} Tour`,
            description: tour.summary,
            images: [`https://www.natours.dev/img/tours/${tour.imageCover}`],
          },
          unit_amount: tour.price * 100,
        },
        quantity: 1,
      }
    ],
    mode: 'payment',
  });

  // 3) Create session as response
  res.status(200).json({
    status: 'success',
    session
  });
});

exports.createBookingCheckout = catchAsync (async (req, res, next) => {
    //This is temporary, because this is unsecure everyone can make bookings without paying
    const { tour, user, price } = req.query;

    if(!tour && !user && !price) return next()
    
    
    
    await Booking.create({tour, user, price})
    
    res.redirect(req.originalUrl.split('?')[0])
    
})

exports.createBooking = factory.createOne(Booking)
exports.getBooking = factory.getOne(Booking)
exports.getAllBooking = factory.getAll(Booking)
exports.updateBooking = factory.updateOne(Booking)
exports.deleteBooking = factory.deleteOne(Booking)