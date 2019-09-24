const validator = require('validator');
const isEmpty = require('./is-empty')

const validateLoginInput = (data) => {
   let errors = {};

   data.email = !isEmpty(data.email) ? data.email : '';
   data.password = !isEmpty(data.password) ? data.password : '';

   //Email
   if(validator.isEmpty(data.email)){
      errors.email = 'Email field is Required'
   }else if(!validator.isEmail(data.email)){
      errors.email = 'Email is Invalid'
   }
   
   //Password
   if(validator.isEmpty(data.password)){
      errors.password = 'Password field is Required'
   }

   return {
      errors,
      isValid: isEmpty(errors)
   }
}

module.exports = validateLoginInput