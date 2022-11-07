const mongoose = require('mongoose');
const { DateTime } = require('luxon');
const { format } = require('morgan');

const Schema = mongoose.Schema;

const AuthorSchema = new Schema({
  first_name: { type: String, required: true, maxLength: 100 },
  family_name: { type: String, required: true, maxLength: 100 },
  date_of_birth: { type: Date },
  date_of_death: { type: Date },
});

AuthorSchema.virtual('name').get(function () {
  return (this.first_name && this.family_name)
    ? `${this.family_name}, ${this.first_name}`
    : '';
});

AuthorSchema.virtual('url').get(function () {
  return `catalog/author/${this._id}`;
});

AuthorSchema.virtual('birth_date').get(function () {
  return formattedDate(this.date_of_birth);
});

AuthorSchema.virtual('death_date').get(function () {
  return formattedDate(this.date_of_death);
});

function formattedDate(date) {
  return (date)
    ? DateTime.fromJSDate(date).toLocaleString(DateTime.DATE_MED)
    : 'unknown';
}

module.exports = mongoose.model('Author', AuthorSchema);
