const catchAsync = require('./../utils/catchAsync')
const AppError = require('./../utils/appError')
const APIFeatures = require('./../utils/apiFeatures')
const { populate } = require('../models/reviewModel')

exports.deleteOne = Model => catchAsync(async (req, res, next)=>{
    const doc = await Model.findByIdAndDelete(req.params.id)
    if(!doc) {
     return next(new AppError('No Document Find with that ID', 404))
  }  
    
    res.status(204).json({
          status: 'success',
          data: null
      });
 //  catch (err){
 //     res.status(404).json({
 //         status: 'fail',
 //         message: 'Invalid data sent!'
 //     });
 //  }
})

exports.updateOne = Model => catchAsync(async (req, res, next)=>{
  const doc = await Model.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
  })
  
  if(!doc) {
      return next(new AppError('No document Find with that ID', 404))
   }
   
  res.status(200).json({
      status: 'success',
      data: {
          data: doc
      }
  })
})


exports.createOne = Model => catchAsync( async (req, res, next)=>{
  const doc = await Model.create(req.body)
      
      res.status(201).json({
          status: 'success',
          data: {
              data: doc
          }
      });
})

exports.getOne = (Model, popOptions) =>  catchAsync(async (req, res, next) =>{
        
    let query = Model.findById(req.params.id);
    if(popOptions) query = query.populate(popOptions)
    const doc = await query;
        // const doc = await Model.findById(req.params.id).populate('reviews')
          
        // .populate({
        //     path: 'guides',
        //     select: '-__v -passwordChangedAt'
        // });
        
        if(!doc) {
           return next(new AppError('No Document Find with that ID', 404))
        }
        res.status(200).json({
            status: 'success',
            data: {
                data: doc
            }   
        });
    })
    
    
exports.getAll = Model => catchAsync(async (req, res, next)=>{

    //To allow for nested GET Reviews on tour (hack)
    let filter = {};
    if(req.params.tourId) filter = {tour: req.params.tourId}
    
    console.log(req.query);
    
    const features = new APIFeatures(Model.find(filter), req.query)
    .filter()
    .sort()
    .limitFields()
    .paginate();
    const doc = await features.query;
    // const doc = await features.query.explain()
    
    res.status(200).json({
        status: 'success',
        // requestedAT: req.requestTime,
        results: doc.length,
        data: {
            data: doc
        }
    })
})
