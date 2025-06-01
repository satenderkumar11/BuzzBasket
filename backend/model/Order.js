const mongoose = require('mongoose');
const { Cart } = require('../model/Cart');

const { Schema } = mongoose;

const addressSchema = new Schema({
  building: {type: String},
  street: { type: String },
  city: { type: String },
  state: { type: String },
  postalCode: { type: String },
  country: { type: String }
}, { _id: false });

const cartItemSchema = new Schema({
  product: { type: Schema.Types.ObjectId, ref: 'Product', required: true },
  quantity: { type: Number, required: true },
},{_id: false});

const orderSchema = new Schema({
  
  cart: [cartItemSchema],
  totalAmount: { type: Number },
  totalItems: { type: Number },
  user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  paymentMethod: { type: String, required: true },
  status: { type: String, default: 'pending' },
  selectedAddress: { type: addressSchema, required: true },
});

const virtual = orderSchema.virtual('id');
virtual.get(function () {
  return this._id;
});
orderSchema.set('toJSON', {
  virtuals: true,
  versionKey: false,
  transform: function (doc, ret) {
    delete ret._id;
  },
});

exports.Order = mongoose.model('Order', orderSchema);
