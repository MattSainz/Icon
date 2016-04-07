/**
 * Created by Matthias on 9/12/15.
 */

'use strict';

var mongoose = require('mongoose'),
               Schema = mongoose.Schema;

module.exports = function(app) {
    var TextContentSchema = new Schema({
        title: {
            type: String,
            trim: true,
            default: 'Title'
        },
        contentBody: {
            type: String,
            trim: false,
            default: ''
        },
        contentType: {
            type: String,
            trim: true,
            default: 'home'
        },
        dateCreated:{
            type: Date,
            default: Date.now()
        }
    });

    mongoose.model('TextContent', TextContentSchema);
};
