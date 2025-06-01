const mongoose = require('mongoose');
const { Schema } = mongoose;

const brandSchema = new Schema({
  slug: {type: String, required: true, unique: true},
  name: {type: String, required: true, unique: true}
},{
  timestamps: true
});

const virtual = brandSchema.virtual('id');
virtual.get(function () {
  return this._id;
});
brandSchema.set('toJSON', {
  virtuals: true,
  versionKey: false,
  transform: function (doc, ret) {
    delete ret._id;
  },
});

exports.Brand = mongoose.model('Brand', brandSchema);
