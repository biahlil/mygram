const { Photo, User, Comment } = require('../models');
const { getPayloadId} = require('../helpers/jwt');


class PhotoController {
    static  getAllPhotos(req,res) {
        Photo.findAll({
            include: [User,Comment]
        })
        .then(result => {
            let responses = {
                photos: result
            }
            res.status(200).json(responses);
        })
        .catch(err => {
            let handlerror = {
                path: err.errors[0].path,
                type: err.errors[0].type,
                message: err.message
            }
            res.status(500).json(handlerror);
        });
    }

    static createPhoto(req, res) {
        const { title,caption,poster_image_url } = req.body;
        const idToken = getPayloadId(req.get('token'));
        Photo.create({
            title: title, 
            caption: caption, 
            poster_image_url: poster_image_url,
            UserId: idToken
        })
            .then(result => {
                let responses = {
                    Photo: {
                        id: result.id,
                        title: result.title, 
                        caption: result.caption,
                        poster_image_url: result.poster_image_url,
                        UserId: result.UserId,
                        createdAt: result.createdAt,
                        updatedAt: result.updatedAt
                    }
                }
                res.status(201).json(responses);
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

    static editPhotoByID(req, res) {
        const idToken = getPayloadId(req.get('token'));
        let id = +req.params.photoId;
        const { title,caption,poster_image_url } = req.body;
        let data = { title: title, caption: caption, poster_image_url: poster_image_url};
        
        Photo.findByPk(id)
        .then(getInfo => {
            if (getInfo.UserId != idToken) {
                let handlerror = {message: "You cannot edit other people's photos"};
                throw handlerror;
            }
            Photo.update(
                data,{
                    where:{id},
                    returning: true
                }
            )
            .then(result => {
                let responses = {
                    photo: {
                        id: result[1][0].id,
                        title: result[1][0].title,
                        caption: result[1][0].caption, 
                        poster_image_url: result[1][0].poster_image_url,
                        UserId: result[1][0].UserId,
                        createdAt: result[1][0].createdAt,
                        updatedAt: result[1][0].updatedAt
                    }
                }
                res.status(200).json(responses);
            })
            .catch(err => {
                let handlerror = {
                    path: err.errors[0].path,
                    type: err.errors[0].type,
                    message: err.message
                }
                res.status(500).json(handlerror);
            })
        })
        .catch(err => {
            if (Object.keys(err).length === 0) {
                let notFoundHandler = {
                    message: "Photo not found"
                }
                res.status(500).json(notFoundHandler);                
            } else {
                res.status(500).json(err);
            }
        })
    }

    static deletePhotoByID(req, res) {
        const idToken = getPayloadId(req.get('token'));
        let id = +req.params.photoId;
        Photo.findByPk(id)
        .then(getInfo => {
            if (getInfo.UserId != idToken) {
                let handlerror = {message: "You cannot delete other people's photos"};
                throw handlerror;
            }
            Photo.destroy({
                where:{id},
                returning: true
            })        
            .then(result => {
                let photo = {
                    message: "Your photo has been successfully deleted" 
                }
                res.status(200).json(photo);
            })
            .catch(err => {
                let handlerror = {
                    path: err.errors[0].path,
                    type: err.errors[0].type,
                    message: err.message
                }
                res.status(500).json(handlerror);
            })
        })
        .catch(err => {
            if (Object.keys(err).length === 0) {
                let notFoundHandler = {
                    message: "Photo not found"
                }
                res.status(500).json(notFoundHandler);                
            } else {
                res.status(500).json(err);
            }
        })
    }
}

module.exports = PhotoController;