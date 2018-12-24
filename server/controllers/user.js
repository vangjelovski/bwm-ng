const User = require('../models/user');
const MongooseHelpers = require('../helpers/mongoose');
const jwt = require('jsonwebtoken');
const config = require('../config/dev');


exports.auth = function(req, res){
    const { email, password } = req.body;

    if (!password || !email) {
        return res.status(422).send({
            errors: [{
                title: 'Data missing!', 
                detail: 'Provide mail and pass'
            }]
        });
    }

    User.findOne({email}, function(err, user) {
        if (err) {
            return res.status(422).send({errors: normalizedErrors(err.errors)});
        }
        if (!user) {
            return res.status(422).send({errors: [{title : 'Invalid User !', detail: 'User does not exist !!!'}] });
   
        }

        if (user.hasSamePassword(password)) {
            const token = jwt.sign({
                userId: user.id,
                username: user.username
               }, config.SECRET, { expiresIn: '1h' });
 

            return res.json(token);
            //return jwt token
        } else {
            return res.status(422).send({errors: [{title : 'Wrong data !', detail: 'Wrong mail or pass !!!'}] });

        }
    });

}


exports.register = function(req, res){
    const { username, email, password, passwordConfirmation } = req.body;

    if (!password || !email) {
        return res.status(422).send({
            errors: [{
                title: 'Data missing!', 
                detail: 'Provide mail and pass'
            }]
        });
    }

    if (password != passwordConfirmation) {
        return res.status(422).send({
            errors: [{
                title: 'Inalid pass!', 
                detail: 'Not same pass'
            }]
        });
    }

    User.findOne({email}, function(err, existingUser) {
        if (err){
            return res.status(422).send({'mongoose': 'Handle mongoose later'}); 
        }

        if (existingUser) {
            return res.status(422).send({
                errors: [{
                    title: 'Existing mail', 
                    detail: 'Mail in use'
                }]
            });  
        }
        
        const user = new User({
            username,
            email,
            password
        });

        user.save(function(err){
            if(err) {
                return res.status(422).send({errors: MongooseHelpers.normalizedErrors(err.errors)}); 
            }

            return res.json({'registered': true});
        });
    });
}


exports.authMiddleware = function(req, res, next) {
    const token = req.headers.authorization;

    if(token) {
        const user = parseToken(token);
        User.findById(user.userId, function(err, user) {
            if(err) {
                return res.status(422).send({errors: normalizedErrors(err.errors)}); 
            } 
            
            if (user) {
                res.locals.user = user;
                next();
            } else {
                return notAuthorized(res);
            }
        });
    } else {
        return notAuthorized(res);
    }
}

function parseToken(token) {  
    return jwt.verify(token.split(' ')[1], config.SECRET);
}

function notAuthorized(res) {
    return res.status(401).send({
        errors: [{
            title: 'not authorised!', 
            detail: 'Need to login for access'
        }]
    });
}