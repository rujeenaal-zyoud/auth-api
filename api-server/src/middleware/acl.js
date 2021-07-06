'use strict';

module.exports = (capability) =>{
    return(req,res,next) =>{
        try {
            //here we have array capabilities and we want to check with acl
           if (req.user.capabilities.includes(capability)) {
            next()
           }
           else{
               next('Access Denied');
           }
       
        }
         catch (e) {
            next('Invalid Login');
 
        }
    }
}