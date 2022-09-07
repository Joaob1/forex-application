const mongoose = require('mongoose');

const ExchangeModel = mongoose.model('Exchange', {
    user_email: String,
    type: String,
    GBP: Number,
    USD: Number,
    date: Date
})

module.exports = ExchangeModel;