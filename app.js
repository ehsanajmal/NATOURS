const path = require('path');

const express = require ('express');
const morgan = require('morgan');

const rateLimit= require('express-rate-limit')
const helmet = require('helmet')

const AppError = require('./utils/appError')
const globalErrorHandler = require('./controllers/errorController')
const mongoSanitize = require('express-mongo-sanitize')
const xss = require('xss-clean')

const tourRouter = require('./routes/tourRoutes')
const userRouter = require('./routes/userRoutes')
const reviewRouter = require('./routes/reviewRoutes')
const viewRouter = require('./routes/viewRoutes')
const bookingRouter = require('./routes/bookingRoutes')
const cookieParser = require('cookie-parser')

// Start express app
const hpp = require('hpp')
const app = express();

app.set('view engine', 'pug');
app.set('views', path.join(__dirname, 'views'))


// app.use(express.static(`${__dirname}/public`));
app.use(express.static(path.join(__dirname, 'public')));


// 1) Global Middleware
if(process.env.NODE_ENV === 'development'){
    app.use(morgan('dev'));
}

const limiter = rateLimit({
    max:100,
    windowMs: 60 * 60 * 1000,
    message: 'Too many request from this IP, please try again in an hour'    
})
app.use('/api', limiter)

app.use(
  helmet({
    crossOriginEmbedderPolicy: false,
    crossOriginResourcePolicy: { policy: 'cross-origin' },
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'", 'data:', 'blob:', 'https:', 'ws:'],
        baseUri: ["'self'"],
        fontSrc: ["'self'", 'https:', 'data:'],
        scriptSrc: [
          "'self'",
          'https:',
          'http:',
          'blob:',
          'https://*.mapbox.com',
          'https://js.stripe.com/',
          'https://m.stripe.network/',
          'https://*.cloudflare.com',
          'https://cdnjs.cloudflare.com/ajax/libs/axios/0.25.0/axios.js',
        ],
        frameSrc: ["'self'", 'https://js.stripe.com/'],
        objectSrc: ["'none'"],
        styleSrc: ["'self'", 'https:', "'unsafe-inline'"],
        workerSrc: [
          "'self'",
          'data:',
          'blob:',
          'https://*.tiles.mapbox.com',
          'https://api.mapbox.com/',
          'https://events.mapbox.com/',
          'https://m.stripe.network/',
        ],
        childSrc: ["'self'", 'blob:'],
        imgSrc: ["'self'", 'data:', 'blob:'],
        formAction: ["'self'"],
        connectSrc: [
          "'self'",
          "'unsafe-inline'",
          'data:',
          'blob:',
          'https://*.stripe.com',
          'https://*.mapbox.com',
          'https://*.cloudflare.com/',
          'https://bundle.js/:*',
          'ws://127.0.0.1:*/',
        ],
        upgradeInsecureRequests: [],
      },
    },
  })
);


app.use(express.json({limit: '10kb'}));
app.use(express.urlencoded({ extended: true, limit: '10kb' }))
app.use(cookieParser())


// Data sanitization against NoSQL query injection
app.use(mongoSanitize());

//Data Sanitization against 
app.use(xss());

//Prevent parameter polltuion
app.use(hpp({
    whitelist: [
        'duration', 'ratingsQuantity', 'ratingsAvergae', 'maxGroupSize', 'difficulty',
        'price', 
    ]
}))

// app.use((req, res, next)=>{
//    console.log("Hello from the Middleware");
//    next();
// });

app.use((req, res, next)=>{
    req.requestTime = new Date().toISOString();
    // console.log(req.headers)
    // console.log(req.cookies)
    next();
    
});


// 3) Routes

app.use('/', viewRouter)
app.use('/api/v1/tours', tourRouter);
app.use('/api/v1/users', userRouter);
app.use('/api/v1/reviews', reviewRouter);
app.use('/api/v1/bookings', bookingRouter)

app.all('*', (req, res, next)=>{
    // res.status(404).json({
    //     status: 'fail',
    //     message: `Can't find ${req.originalUrl} on this server!`
    // })
    
    // const err = new Error(`Can't find ${req.originalUrl} on this server!`);
    // err.status = 'fail';
    // err.statusCode = 404;
    
    next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
})



app.use(globalErrorHandler)



module.exports = app;






// app.get('/api/v1/tours', getAllTours);
// app.post('/api/v1/tours', creatTour);
// app.get('/api/v1/tours/:id', getTour);
// app.patch('/api/v1/tours/:id', updateTour);
// app.delete('/api/v1/tours/:id', deletTour);
