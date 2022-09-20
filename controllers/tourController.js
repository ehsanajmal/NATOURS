const multer = require('multer');
const sharp = require('sharp');
const Tour = require('./../models/tourModel')
const APIFeatures = require('./../utils/apiFeatures')
const catchAsync = require('./../utils/catchAsync')
const AppError = require('./../utils/appError')
const factory = require('./handlerFactory')

const multerStorage = multer.memoryStorage();

const multerFilter = (req, file, cb) => {
  if (file.mimetype.startsWith('image')) {
    cb(null, true);
  } else {
    cb(new AppError('Not an image! Please upload only images.', 400), false);
  }
};

const upload = multer({
  storage: multerStorage,
  fileFilter: multerFilter
});

exports.uploadTourImages = upload.fields([
  { name: 'imageCover', maxCount: 1 },
  { name: 'images', maxCount: 3 }
]);

// upload.single('images')
// upload.array('images', 5)

exports.resizeTourImages = catchAsync( async(req, res, next) => {
    // console.log(req.files)

    if(!req.files.imageCover || !req.files.images) return next()
    
    // COVER IMAGE
    req.body.imageCover = `tour-${req.params.id}-${Date.now()}-cover.jpeg`
    
    await sharp(req.files.imageCover[0].buffer).resize(2000, 1333).toFormat('jpeg').jpeg({quality: 90}).toFile(`public/img/tours/${req.body.imageCover}`)
    // req.body.imageCover = imageCoverFilename
    
    // IMAGES
    req.body.images = []
    await Promise.all(req.files.images.map(async(file, i)=> {
        const filename = `tour-${`tour-${req.params.id}-${Date.now()}-${i + 1}.jpeg`}`
        await sharp(file.buffer).resize(2000, 1333).toFormat('jpeg').jpeg({quality: 90}).toFile(`public/img/tours/${filename}`)
        req.body.images.push(filename)
    }))
    
    next();
})

exports.aliasTopTour = (req, res, next) => { 
    req.query.limit = '5';
    req.query.sort = '-ratingsAverage,price'
    req.query.fields = 'name,price,ratingsAverage,summary,difficulty';
    next();
}



// const fs = require('fs');
// const tours = JSON.parse( fs.readFileSync(`${__dirname}/../dev-data/data/tours-simple.json`));

// exports.checkID = (req, res, next, val) =>{
//     console.log(`Tour id is: ${val}`);
//     if(req.params.id * 1 > tours.length){
//         return res.status(404).json({
//           status: 'fail',
//           message: 'invalid ID'
//        });
//    }
//     next();
// }

// exports.checkbody = (req, res, next) => {
//     if (!req.body.name || !req.body.price){
//         return res.status(400).json({
//             status: 'fail',
//             message: 'Missing the name or price'
//         })
//     }
//     next();
// }


// 2) Tour Route Handlers

exports.getAllTours = factory.getAll(Tour)



// catchAsync(async (req, res, next)=>{

//     console.log(req.query);
    
//     const features = new APIFeatures(Tour.find(), req.query)
//     .filter()
//     .sort()
//     .limitFields()
//     .paginate();
//     const tours = await features.query
    
//     res.status(200).json({
//         status: 'success',
//         // requestedAT: req.requestTime,
//         results: tours.length,
//         data: {
//             tours
//         }
//     })
// })

exports.getTour = factory.getOne(Tour, {path: 'reviews',})


// catchAsync(async (req, res, next) =>{
//         const tour = await Tour.findById(req.params.id).populate('reviews')
        
//         // .populate({
//         //     path: 'guides',
//         //     select: '-__v -passwordChangedAt'
//         // });
        
//         if(!tour) {
//            return next(new AppError('No Tour Find with that ID', 404))
//         }
//         res.status(200).json({
//             status: 'success',
//             data: {
//                 tour
//             }   
//         });
    // console.log(req.params);
    // const id = req.params.id * 1;
    // const tour =tours.find(el=> el.id === id);
    
    // if(id>tours.length){
    // if(!tour){
    //     return res.status(404).json({
    //         status: 'fail',
    //         message: 'invalid ID'
    //     })
    // }
    
    // res.status(200).json({
    //     status: 'success',
    //     results: tours.length,
    //     data: {
    //         tour
    //     }   
    // });     
// })

exports.creatTour = factory.createOne(Tour)




// catchAsync( async (req, res, next)=>{
//     const newTour = await Tour.create(req.body)
        
//         res.status(201).json({
//             status: 'success',
//             data: {
//                 tour: newTour
//             }
//         });
    
    // try {
        
        
    // }
    // catch(err) {
    //     res.status(400).json({
    //         status: 'fail',
    //         message: err
    //     });
    // }
    
    
    // console.log(req.body);
    
    // const newId = tours[tours.length-1].id +1;
    // const newTour = Object.assign({id: newId}, req.body);
    
    // tours.push(newTour);
    // fs.writeFile(`${__dirname}/dev-data/data/tours-simple.json`, 
    // JSON.stringify (tours),
    // err=>{
    //     res.status(201).json({
    //         status: 'success',
    //         data: {
    //             tour: newTour
    //         }
    //     })
    // })

// });

exports.updateTour = factory.updateOne(Tour)



// catchAsync(async (req, res, next)=>{
//     const tour = await Tour.findByIdAndUpdate(req.params.id, req.body, {
//         new: true,
//         runValidators: true
//     })
    
//     if(!tour) {
//         return next(new AppError('No Tour Find with that ID', 404))
//      }
     
//     res.status(200).json({
//         status: 'success',
//         data: {
//             tour
//         }
//     })
    
    // catch (err) {
    //     res.status(404).json({
    //         status: 'fail',
    //         message: err
    //     });
    // }
    // if(req.params.id * 1 > tours.length){
    //  return res.status(404).json({
    //    status: 'fail',
    //    message: 'invalid ID'
    // })
    // }
        
// })

exports.deletTour=factory.deleteOne(Tour);

// exports.deletTour = catchAsync(async (req, res, next)=>{
//        const tour = await Tour.findByIdAndDelete(req.params.id)
//        if(!tour) {
//         return next(new AppError('No Tour Find with that ID', 404))
//      }  
       
//        res.status(204).json({
//              status: 'success',
//              data: null
//          });
        
     
//     //  catch (err){
//     //     res.status(404).json({
//     //         status: 'fail',
//     //         message: 'Invalid data sent!'
//     //     });
//     //  }
// })

exports.getTourStats = catchAsync(async (req, res, next) =>{
    
        const stats = await Tour.aggregate([
            {
                $match: { ratingsAverage: {$gte: 4.5} }
            },
            {
                $group: {
                    _id: {$toUpper: '$difficulty'},
                    numTour: {$sum: 1 },
                    numRatings: {$sum: '$ratingsQuantity'},
                    avgRating: {$avg: '$ratingsAverage'},
                    avgPrice: {$avg: '$price'},
                    minPrice: {$min: '$price'},
                    maxPrice: {$max: '$price'},
                }
            },
            {
            $sort: {avgPrice: 1}
             },
            //  {
            //     $match: {_id: {$ne: 'EASY'}}
            //  }
             
        ]);
        res.status(200).json({
            status: 'success',
            data: {
                stats
            }
        })
    
    // catch(err) {
    //     res.status(404).json({
    //         status: 'fail',
    //         message: 'Invalid data sent!'
    //     });
    // }
})

exports.getMothlyPlan = catchAsync(async(req, res, next) => {
        const year = req.params.year * 1;
        
        const plan = await Tour.aggregate([
            {
                $unwind: '$startDates'
            },
            {
                $match: {
                    startDates: {
                        $gte: new Date(`${year}-01-01`), 
                        $lte: new Date(`${year}-12-31`), 
                    }
                    
                }
            },    
                {
                    $group: {
                        _id: {$month: '$startDates'},
                        numTourStarts: {$sum: 1},
                        tours: {$push: '$name' }
                    }
                },
                {
                $addFields: {month: '$_id'},
            },
            {
                $project: {
                    _id: 0
                }
            },
            {
                $sort: {numTourStarts: -1},
            },
            {
                $limit: 6
            }
            
        ])
        
        res.status(200).json({
            status: 'success',
            length: plan.length,
            data: {
                plan
            }
        });
    
    
    // catch(err) {
    //     res.status(404).json({
    //         status: 'fail',
    //         message: 'Invalid data sent!'
    //     });
    // }
})

// /tours-distance/:233/center/34.111745,-118.113491/unit/mi, tourController.getToursWithin

exports.getToursWithin = catchAsync( async (req, res, next) => {
    const { distance, latlng, unit } = req.params
    const [lat, lng] = latlng.split(',');
    
    const radius = unit === 'mi' ? distance / 3963.2 : distance / 6378.1;
    
    if(!lat || !lng) {
        next(new AppError('Please provide lattitue and longitude in the format lat, lng.', 400))
    }
    
    const tours = await Tour.find({
        startLocation: { $geoWithin: { $centerSphere: [[lng, lat], radius] } }
      });
    
    //   console.log(tours)
        console.log(distance, lat, lng, unit)
        res.status(200).json({
            status: 'success',
            result: tours.length,
            data: {
                data: tours
            }
        })
})

exports.getDistances = catchAsync(async(req, res, next)=>{
    const { latlng, unit } = req.params
    const [lat, lng] = latlng.split(',');
    
    const multiplier = unit === 'mi' ? 0.000621371 : 0.001;
    
    if(!lat || !lng) {
        next(new AppError('Please provide lattitue and longitude in the format lat, lng.', 400))
    }
    const distances = await Tour.aggregate([
        {
            $geoNear: {
                near: {
                    type: 'Point',
                    coordinates: [lng * 1, lat * 1]
                },
                distanceField: 'distance', 
                distanceMultiplier: multiplier
            }
        },
        {
            $project: {
                distance: 1,
                name: 1
            }
        }
    ])
    res.status(200).json({
        status: 'success',
        data: {
            data: distances
        }
    })
})