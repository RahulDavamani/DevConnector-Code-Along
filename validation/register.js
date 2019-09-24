const validator = require('validator');
const isEmpty = require('./is-empty')

const validateRegisterInput = (data) => {
   let errors = {};

   data.name = !isEmpty(data.name) ? data.name : '';
   data.email = !isEmpty(data.email) ? data.email : '';
   data.password = !isEmpty(data.password) ? data.password : '';
   data.password2 = !isEmpty(data.password2) ? data.password2 : '';
   
   //Name
   if(validator.isEmpty(data.name)){
      errors.name = 'Name field is Required'
   }else if(!validator.isLength(data.name, {min: 2, max: 30})){
      errors.name = 'Name must be between 2 and 30 Characters' 
   }

   //Email
   if(validator.isEmpty(data.email)){
      errors.email = 'Email field is Required'
   }else if(!validator.isEmail(data.email)){
      errors.email = 'Email is Invalid'
   }
   
   //Password
   if(validator.isEmpty(data.password)){
      errors.password = 'Password field is Required'
   } else if(!validator.isLength(data.password, {min: 6, max: 30})){
      errors.password = 'Password must be between 6 and 30 Characters'
   }
   
   //Confirm Password
   if(validator.isEmpty(data.password2)){
      errors.password2 = 'Confirm Password field is Required'
   }else if(!validator.equals(data.password, data.password2)) {
      errors.password2 = 'Passwords must Match'
   }

   return {
      errors,
      isValid: isEmpty(errors)
   }
}

module.exports = validateRegisterInput