const validator = require('validator');
const isEmpty = require('./is-empty')

const validateEducationInput = (data) => {
   let errors = {};

   data.school = !isEmpty(data.school) ? data.school : '';
   data.degree = !isEmpty(data.degree) ? data.degree : '';
   data.fieldOfStudy = !isEmpty(data.fieldOfStudy) ? data.fieldOfStudy : '';
   data.from = !isEmpty(data.from) ? data.from : '';

   //School
   if(validator.isEmpty(data.school)){
      errors.school = 'School Field is Required'
   }
   
   //Degree
   if(validator.isEmpty(data.degree)){
      errors.degree = 'Degree Field is Required'
   }
   
   //FieldOfStudy
   if(validator.isEmpty(data.fieldOfStudy)){
      errors.fieldOfStudy = 'FieldOfStudy is Required'
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

module.exports = validateEducationInput