const mongoose = require('mongoose');
const dotenv = require('dotenv');
process.on('uncaughtException', err => {
    console.log('UNCAUGHT EXCEPTION! 💥 Shutting down...');
    console.log(err.name, err.message);
    process.exit(1);
  });
  

dotenv.config({path: './config.env'});

const app = require('./app');

const DB = process.env.DATABASE.replace('<PASSWORD>', process.env.DATABASE_PASSWORD);

mongoose.connect(DB, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false
}).then(() => 
    console.log('DB connection successful!'));


// console.log(process.env);
// 4) Start Server
const port = process.env.PORT || 3000;

const server = app.listen(port, ()=>{
    console.log(`App running on port ${port}...`);
});


process.on('unhandledRejection', err=>{
    console.log(err.name, err.message);
    console.log('Unhandled Rejection! 💥 Shutting Down...')
    server.close(()=>{
        process.exit(1);
    })
})


  















// const testTour = new Tour({
//     name: 'The Park Camper',
//     price: 997
// });

// testTour.save().then(doc=> {
//     console.log(doc);
// }).catch(err=>{
//     console.log('ERROR :', err);
// });
