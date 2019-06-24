const joi = require('joi')

function validationService(type, data){
    let schema = {}

    switch(type){

        case 'registerUser':
            schema = {
                id: joi.string().min(1).max(125).required(),
                username: joi.string().min(1).max(125).required(),
                password: joi.string().required(),
                email: joi.string().email().required()
            }
            break;

        case 'loginUser':
            schema = {
                id: joi.string().min(1).max(125).required(),
                password: joi.string().required()
            }
            break;
        
        case 'editUser':
            schema = {
                id: joi.string().min(1).max(125).required(),
                username: joi.string().min(1).max(125).required(),
                email: joi.string().email().required()
            }
            break;

        case 'newTweet':
            schema = {
                body: joi.string().min(1).max(255).required()
            }
            break;

        case 'replyTweet':
            schema = {
                body: joi.string().min(1).max(255).required()
            }
            break;



    }
    return joi.validate(data, schema)
}

module.exports = validationService
