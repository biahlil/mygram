'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      this.hasMany(models.Photo);
      this.hasMany(models.Comment);
      this.hasOne(models.SocialMedia);
      // define association here
    }
  }
  User.init({
    full_name: {
      type: DataTypes.STRING,
      allowNull: false
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        isEmail: { message: 'Must be a valid email address'}
      }
    },
    username: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false
    },
    profile_image_url: {
      type: DataTypes.TEXT,
      allowNull: false,
      validate: {
        isUrl: { message: 'Please enter a valid URL' }
      }
    },
    age: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        isInt: { message: 'Must be a Number'}
      }
    },
    phone_number: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        isInt: { message: 'Must be a Number'}        
      }
    }
  }, {
    sequelize,
    modelName: 'User',
    
  });
  return User;
};