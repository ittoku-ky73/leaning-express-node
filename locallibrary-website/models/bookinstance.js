const mongoose = require('mongoose');
const moment = require('moment');

let Schema = mongoose.Schema;

let BookInstanceSchema = new Schema({
  book: {type: Schema.Types.ObjectId, ref: 'Book', required: true}, // reference to the associated book
  imprint: {type: String, required: true},
  status: {type: String, required: true, enum: ['Available', 'Maintenance', 'Loaned', 'Reserved'], default: 'Maintenance'},
  due_back: {type: Date, default: Date.now},
});

// Virtual for bookinstance's URL
BookInstanceSchema
  .virtual('url')
  .get(function() {
    return '/catalog/bookinstance/' + this._id;
  });

// Virtual for bookinstance's formatted due_back
BookInstanceSchema
  .virtual('due_back_formmatted')
  .get(function() {
    return moment(this.due_back).format('MMMM Do, YYYY');
  });

// Export model
module.exports = mongoose.model('BookInstance', BookInstanceSchema);
