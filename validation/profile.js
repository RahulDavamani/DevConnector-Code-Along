const validator = require('validator');
const isEmpty = require('./is-empty')

const validateProfileInput = (data) => {
   let errors = {};

   data.handle = !isEmpty(data.handle) ? data.handle : '';
   data.status = !isEmpty(data.status) ? data.status : '';
   data.skills = !isEmpty(data.skills) ? data.skills : '';

   //Handle
   if(validator.isEmpty(data.handle)){
      errors.handle = 'Profile Handle is Required'
   } else if(!validator.isLength(data.handle, {min: 2, max: 40})){
      errors.handle = 'Handle must be between 2 and 40 Characters' 
   }

   //Status
   if(validator.isEmpty(data.status)){
      errors.status = 'Status Field is Required'
   }

   //Skills
   if(validator.isEmpty(data.skills)){
      errors.skills = 'Skills Field is Required'
   }

   //Website
   if(!isEmpty(data.website)){
      if(!validator.isURL(data.website)){
         errors.website = 'Not a Valid URL'
      }
   }

   //Youtube
   if(!isEmpty(data.youtube)){
      if(!validator.isURL(data.youtube)){
         errors.youtube = 'Not a Valid URL'
      }
   }

   //Facebook
   if(!isEmpty(data.facebook)){
      if(!validator.isURL(data.facebook)){
         errors.facebook = 'Not a Valid URL'
      }
   }

   //Twitter
   if(!isEmpty(data.twitter)){
      if(!validator.isURL(data.twitter)){
         errors.twitter = 'Not a Valid URL'
      }
   }

   //Instagram
   if(!isEmpty(data.instagram)){
      if(!validator.isURL(data.instagram)){
         errors.instagram = 'Not a Valid URL'
      }
   }

   //Linkedin
   if(!isEmpty(data.linkedin)){
      if(!validator.isURL(data.linkedin)){
         errors.linkedin = 'Not a Valid URL'
      }
   }

   return {
      errors,
      isValid: isEmpty(errors)
   }
}

module.exports = validateProfileInput