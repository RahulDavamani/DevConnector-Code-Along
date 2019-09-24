const validator = require('validator');
const isEmpty = require('./is-empty')

const validateExperienceInput = (data) => {
   let errors = {};

   data.title = !isEmpty(data.title) ? data.title : '';
   data.company = !isEmpty(data.company) ? data.company : '';
   data.from = !isEmpty(data.from) ? data.from : '';

   //Title
   if(validator.isEmpty(data.title)){
      errors.title = 'Title Field is Required'
   }
   
   //Company
   if(validator.isEmpty(data.company)){
      errors.company = 'Company Field is Required'
   }
   
   //From
   if(validator.isEmpty(data.from)){
      errors.from = 'From Date Field is Required'
   }

   return {
      errors,
      isValid: isEmpty(errors)
   }
}

module.exports = validateExperienceInput