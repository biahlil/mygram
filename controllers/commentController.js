const { Photo, User, Comment } = require('../models');
const { getPayloadId} = require('../helpers/jwt');

class CommentController {

    static create(req, res) {
        const { comment,PhotoId } = req.body;
        const idToken = getPayloadId(req.get('token'));
        
        Comment.create({
            comment: comment, 
            PhotoId: PhotoId,
            UserId: idToken
        })
            .then(result => {
                let responses = {
                    comment: {
                        id: result.id,
                        comment: result.comment, 
                        PhotoId: result.PhotoId,
                        UserId: result.UserId,
                        createdAt: result.createdAt,
                        updatedAt: result.updatedAt
                    }
                }
                res.status(201).json(responses);
            })
            .catch(err => {
                if (err.name === "SequelizeForeignKeyConstraintError") {
                    let notFoundHandler = {
                        message: "Photo not found"
                    }
                    res.status(500).json(notFoundHandler);                
                } else if (err.name === "SequelizeDatabaseError") {
                    let notFoundHandler = {
                        message: "Photo Id must be an integer"
                    }
                    res.status(500).json(notFoundHandler);
                } else {
                    let handlerror = {
                    path: err.errors[0].path,
                    type: err.errors[0].type,
                    message: err.message
                    }
                    res.status(500).json(handlerror);
                }
            })
    }

    static  getAllComments(req,res) {
        Comment.findAll({
            include: [User,Photo]
        })
        .then(result => {
            let responses = {
                comments: result
            }
            res.status(200).json(responses);
        })
        .catch(err => {
            res.status(500).json(err);
        });
    }

    static editCommentByID(req, res) {
        const idToken = getPayloadId(req.get('token'));
        let id = +req.params.commentId;
        const { comment } = req.body;
        let data = { comment: comment};
        
        Comment.findByPk(id)
        .then(getInfo => {
            if (getInfo.UserId != idToken) {
                let handlerror = {message: "You cannot edit other people's comments"};
                throw handlerror; 
            }
            Comment.update(
                data,{
                    where:{id},
                    returning: true
                }
            )
            .then(result => {
                let responses = {
                    comment: {
                        id: result[1][0].id,
                        comment: result[1][0].comment,
                        UserId: result[1][0].UserId,
                        PhotoId: result[1][0].PhotoId, 
                        createdAt: result[1][0].createdAt,
                        updatedAt: result[1][0].updatedAt
                    }
                }
                res.status(200).json(responses);
            })
            .catch(err => {
                // let handlerror = {
                //     path: err.errors[0].path,
                //     type: err.errors[0].type,
                //     message: err.message
                // }
                res.status(500).json(err);
            })
        })
        .catch(err => {
            if (Object.keys(err).length === 0) {
                let notFoundHandler = {
                    message: "Comment not found"
                }
                res.status(500).json(notFoundHandler);                
            } else {
                res.status(500).json(err);
            }
        })
    }

    static deleteCommentByID(req, res) {
        const idToken = getPayloadId(req.get('token'));
        let id = +req.params.commentId;
        Comment.findByPk(id)
        .then(getInfo => {
            if (getInfo.UserId != idToken) {
                let handlerror = {message: "You cannot delete other people's comments"};
                throw handlerror;
            }
            Comment.destroy({
                where:{id},
                returning: true
            })        
            .then(result => {
                let comment = {
                    message: "Your comment has been successfully deleted" 
                }
                res.status(200).json(comment);
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
                    message: "Comment not found"
                }
                res.status(500).json(notFoundHandler);                
            } else {
                res.status(500).json(err);
            }
        })
    }

}

module.exports = CommentController;