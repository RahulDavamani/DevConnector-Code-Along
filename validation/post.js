const validator = require('validator');
const isEmpty = require('./is-empty')

const validatePostInput = (data) => {
   let errors = {};

   data.text = !isEmpty(data.text) ? data.text : '';

   //Text
   if(validator.isEmpty(data.text)){
      errors.text = 'Text field is Required'
   }else if(!validator.isLength(data.text, { min:10, max:300 })){
      errors.text = 'Post must be between 10 and 300 Characters'
   }

   return {
      errors,
      isValid: isEmpty(errors)
   }
}

module.exports = validatePostInput