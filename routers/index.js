const router = require('express').Router();
const UserController = require('../controllers/userController');
const auth = require('../middlewares/auth');
const PhotoController = require('../controllers/photoController');
const CommentController = require('../controllers/commentController');
const SocialMediaController = require('../controllers/socialMediaController');

router.post('/users/register',UserController.register);
router.post('/users/login',UserController.login);

router.use(auth);
router.put('/users/:userId',UserController.update);
router.delete('/users/:userId',UserController.delete);

router.post('/photos',PhotoController.createPhoto);
router.get('/photos',PhotoController.getAllPhotos);
router.put('/photos/:photoId',PhotoController.editPhotoByID);
router.delete('/photos/:photoId',PhotoController.deletePhotoByID);

router.post('/comments',CommentController.create);
router.get('/comments',CommentController.getAllComments);
router.put('/comments/:commentId',CommentController.editCommentByID);
router.delete('/comments/:commentId',CommentController.deleteCommentByID);

router.post('/socialmedias',SocialMediaController.create);
router.get('/socialmedias',SocialMediaController.getAllSocialMedia);
router.put('/socialmedias/:socialMediaId',SocialMediaController.editSocialMediaByID);
router.delete('/socialmedias/:socialMediaId',SocialMediaController.deleteSocialMediaByID);

module.exports = router;