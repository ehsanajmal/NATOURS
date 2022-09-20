const express = require('express')
const viewController = require('../controllers/viewsController')
const authController = require('./../controllers/authController')
const bookingController = require('../controllers/bookingController')
const router = express.Router()


// router.get('/', (req, res) => {
//     res.status(200).render('base', {
//         tour: 'The Forest Hiker',
//         user: 'Jonas' 
//     });
// })

router.use(authController.isLoggedIn) 

router.get('/', bookingController.createBookingCheckout, authController.isLoggedIn, viewController.getOverview)

// router.get('/tour/:slug', authController.protect, viewController.getTour)

router.get('/tour/:slug', authController.isLoggedIn, viewController.getTour)

router.get('/login', authController.isLoggedIn, viewController.getLoginForm)

router.get('/me', authController.protect, viewController.getAccount)

router.get('/my-tours', authController.protect, viewController.getMyTour)

router.post('/submit-user-data', authController.protect, viewController.updateUserData)
module.exports = router