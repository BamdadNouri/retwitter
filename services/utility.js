const tweetData = require('../models/tweet')

exports.handlehashtag = async(body, tweetId) => {
    var regex = /(?:^|\s)(?:#)([a-zA-Z\d]+)/gm
    var matches = [],
        match = ''

    while((match = regex.exec(body))){
        matches.push(match[1])
    }

    return await Promise.all(matches.map((tagN) => {
        tweetData.hashtagHandler(tagN, tweetId)
    }))
}