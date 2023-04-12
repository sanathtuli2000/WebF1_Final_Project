var mongoose = require('mongoose');


var port     = process.env.PORT || 8000;
var Sale = require('../models/Sale');
module.exports = {
    url : "mongodb+srv://1234:1234@test.lfaizqd.mongodb.net/Final_Project?retryWrites=true&w=majority"
};
module.exports.initialize = (connectionStirng) => {
    //console.log(connectionStirng);
    //console.log(__dirname);
    console.log("Connecting to database"+connectionStirng)
    mongoose.connect(connectionStirng)
    .then( () => {
        console.log('Connected to the database ')
		//console.log( mongoose);
    })
    .catch( (err) => {
        console.error(`Error connecting to the database. n${err}`);
        process.exit(1);
		//app.off()
    })
}
// module.exports.getMovieById = (id) => {
//     const get_data = new Promise(function(resolve, reject) {
//         Movie.findById(id, function(err, movie) {
//             if (err){
//                 response=err
//                 reject(err);
//             }
//             console.log("line 32"+movie)
//             response= movie;
//             resolve(movie)
//         });
//       });
//       //return promise 
//       console.log(get_data)
//       return get_data;
// }
// module.exports.addNewMovie=(data)=>{
   
//     const get_data = new Promise(function(resolve, reject) {
        
//             var d=Movie.create(data,function(err, movie) {
//                 if(err){
//                     console.log("err check kar le"+err)
//                     resolve(false)
//                 }else{
//                     resolve(true)
//                 }
//             });
//             //resolve(true)
        
//       });
//       //return promise 
//       console.log(get_data)
//       return get_data;
    

// }

// module.exports.getAllMovies=(page_p, perPage_p, title_p)=>{
//     var findBy; 
//     var token= new RegExp(title_p,'i')
//     console.log(token);
//     if(title_p){
//         findBy={title:/${title_p}/};
//         console.log("inside if");
//         findBy={title:{$regex: "/^" + title_p + "/"}};
//     }else{
//         console.log("inside else")
//         findBy={};
//     }
//     console.log("check find by"+findBy.title);
//     const get_data = new Promise(function(resolve, reject) {
//         Movie.find({title:token},function(err, movie) {
//             if (err){
//                 response=err
//                 reject(err);
//             }
//             //console.log("line getAllMovies"+movie)
//             response= movie;
//             resolve(movie)
//         }).skip(page_p * +perPage_p).limit(perPage_p)
//     });
//     //console.log(get_data);
//     return get_data;
    
// }

// module.exports.updateMovieById=(data,id)=>{
    
// }

// module.exports.deleteMovieById=(data)=>{
//     console.log(data)
//     deleteFilter={
//         _id:data
//     }
//     const get_data = new Promise(function(resolve, reject) {
//         Movie.findByIdAndRemove(deleteFilter,function(err, movie) {
//             if (err){
//                 response=err
//                 reject(err);
//             }
//             console.log("line deleteMovieById")
//             response= movie;
//             resolve("Record deleted")
//     });

//console.log(get_data);

// });   
// return get_data; 
// }