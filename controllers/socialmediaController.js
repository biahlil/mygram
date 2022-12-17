const { User, SocialMedia } = require('../models');
const { getPayloadId} = require('../helpers/jwt');

class SocialMediaController {

    
    static create(req, res) {
        const { name,social_media_url } = req.body;
        const idToken = getPayloadId(req.get('token'));
        SocialMedia.create({
            name: name, 
            social_media_url: social_media_url,
            UserId: idToken
        })
            .then(result => {
                let responses = {
                    social_media: {
                        id: result.id,
                        name: result.name, 
                        social_media_url: result.social_media_url,
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

    static  getAllSocialMedia(req,res) {
        SocialMedia.findAll({
            include: User
        })
        .then(result => {
            let responses = {
                social_medias: result
            }
            res.status(200).json(responses);
        })
        .catch(err => {
            res.status(500).json(err);
        });
    }

    static editSocialMediaByID(req, res) {
        const idToken = getPayloadId(req.get('token'));
        let id = +req.params.socialMediaId;
        const { name,social_media_url } = req.body;
        let data = {name: name, social_media_url:social_media_url}

        SocialMedia.findByPk(id)
        .then(getInfo => {
            if (getInfo.UserId != idToken) {
                let handlerror = {message: "You cannot edit other people's Social Media"};
                throw handlerror;
            }
            SocialMedia.update(
                data,{
                    where:{id},
                    returning: true
                }
            )
            .then(result => {
                let responses = {
                    social_media: {
                        id: result[1][0].id,
                        name: result[1][0].name,
                        social_media_url: result[1][0].social_media_url, 
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
                    message: "Social Media not found"
                }
                res.status(500).json(notFoundHandler);                
            } else {
                res.status(500).json(err);
            }
        })
    }

    static deleteSocialMediaByID(req, res) {
        const idToken = getPayloadId(req.get('token'));
        let id = +req.params.socialMediaId;
        SocialMedia.findByPk(id)
        .then(getInfo => {
            if (getInfo.UserId != idToken) {
                let handlerror = {message: "You cannot delete other people's Social Media"};
                throw handlerror;
            }
            SocialMedia.destroy({
                where:{id},
                returning: true
            })        
            .then(result => {
                let social_media = {
                    message: "Your social media has been successfully deleted" 
                }
                res.status(200).json(social_media);
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
                    message: "Social Media not found"
                }
                res.status(500).json(notFoundHandler);                
            } else {
                res.status(500).json(err);
            }
        })
    }

}

module.exports = SocialMediaController;