const { User } = require('../models');
const bcrypt = require('bcrypt');
const {generateToken, getPayloadId} = require('../helpers/jwt');

class UserController {

    static register(req,res) {
        let { email,full_name,username,password,profile_image_url,age,phone_number } = req.body;
        password = bcrypt.hashSync(password,10);
        User.create({ full_name,email,username,password,profile_image_url,age,phone_number})
        .then(result => {
            let response ={
                User: {
                    email: result.email,
                    full_name: result.full_name,
                    username: result.username,
                    profile_image_url: result.profile_image_url,
                    age: result.age,
                    phone_number: result.phone_number                
                }
            }
            res.status(201).json(response);
        })
        .catch(err => {
            let handlerror = {
                path: err.errors[0].path,
                type: err.errors[0].type,
                message: err.message
            }
            res.status(500).json(handlerror);
        })
    }

    static login(req, res) {
        let { email, password } = req.body;
        User.findOne({
            where: {email}
        })
        .then(user => {
            if (email != user.email) {
                let handlerror = {
                    name: 'User Login Failed',
                    devMessage: 'User password with email ' + user.email + ' does not match'
                }
                throw handlerror;
            }
            const isCorrect = bcrypt.compareSync(password, user.password);
            if(!isCorrect) {
                let handlerror = {
                    name: 'User Login Failed',
                    devMessage: 'User password with email ' + user.email + ' does not match'
                }
                throw handlerror;
            }
            let payload = {
                id: user.id,
                email: user.email
            }
            const token = generateToken(payload);
            return res.status(200).json({token})
        })
        .catch(err => {
            res.status(500).json(err);
        })
    }

    static update(req, res) {
        const idToken = getPayloadId(req.get('token'));
        const id = +req.params.userId;
        try {
            if (idToken != id) {
                let handlerror = {message: "You cannot edit other people's accounts"};
                throw handlerror;
            }    
            const {full_name,email,username,profile_image_url,age,phone_number} = req.body;
            let data = {
                full_name: full_name,
                email: email,
                username: username,
                profile_image_url: profile_image_url,
                age: age,
                phone_number: phone_number
            };
            User.update(
                data,{
                    where:{id},
                    returning: true
                }
            )
            .then(result => {
                let response ={
                    User: {
                        email: result[1][0].email,
                        full_name: result[1][0].full_name,
                        username: result[1][0].username,
                        profile_image_url: result[1][0].profile_image_url,
                        age: result[1][0].age,
                        phone_number: result[1][0].phone_number                
                    }
                }            
                res.status(200).json(response);
            })
            .catch(err => {
                let handlerror = {
                    path: err.path,
                    type: err.type,
                    message: err.message
                }
                res.status(500).json(handlerror);
                })
    
        } catch (error) {
            res.status(500).json(error);
        }
    }

    static delete(req, res) {
        const idToken = getPayloadId(req.get('token'));
        const id = +req.params.userId;
        try {
            if (idToken != id) {
                let handlerror = {message: "You cannot delete other people's accounts"};
                throw handlerror;
            }
            User.destroy({
                where: {
                  id: id
                }
              })
              .then(result => {
                let response ={
                    message: 'Your account has been successfully deleted'
                }            
                res.status(200).json(response);
            })
            .catch(err => {
                let handlerror = {
                    path: err.errors[0].path,
                    type: err.errors[0].type,
                    message: err.message
                }
                res.status(500).json(handlerror);
                })
        } catch (err) {
            res.status(500).json(err);
        }
    }
}
module.exports = UserController;