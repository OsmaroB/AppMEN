const helpers = {};
//Funcion quse se ejecuta dependiento de lo que le pasemos
helpers.isAuthenticated = (req, res, next) =>{
    if(req.isAuthenticated()){//Propiedad de passport
        return next();
    }
        req.flash('error_msg','Not Authorized');
        res.redirect('/users/signin');
    
};

module.exports = helpers;