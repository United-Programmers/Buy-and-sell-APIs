/* eslint-disable prettier/prettier */
const mongoose = require("mongoose");
const slugify = require("slugify");

const productSchema = new mongoose.Schema(

  {
    productName: {
      type: String,
      // required: [true, 'please product name is required'],
      unique: true,
      trim: true,
    },
    slug: String,
    ratingsAverage: {
      type: Number,
      default: 4.5,
      min: [1, "Rating must be above 1.0"],
      max: [5, "Rating must be below 5.0"],
      set: (val) => Math.round(val * 10) / 10, //from 4.66666,  to 4.7
    },
    ratingsQuantity: {
      type: Number,
      default: 0,
    },
    price: {
      type: Number,
      required: [true, "A tour must have a price"],
    },
    priceDiscount: {
      type: Number,
      validate: {
        validator: function (val) {
          return val < this.price;
        },
        message: "Discount price ({VALUE}) should be below regular price",
      },
    },
    category: {
      type: String,
    },
    type: {
      type: String,
    },
    ageRange: {
      // Baby, Adult, Teenager, Granny
      type: [String],
    },
    genderType: {
      // Man, Women, Otters
      type: [String],
    },
    summary: {
      type: String,
      trim: true,
      // required: [true, 'Please summery is required']

    },
    productName: {
      type: String,
      // unique: true,
      // trim: true,
    },
    slug: String,
    ratingsAverage: {
      type: Number,
      default: 4.5,
      min: [1, 'Rating must be above 1.0'],
      max: [5, 'Rating must be below 5.0'],
      set: val => Math.round(val * 10) / 10 //from 4.66666,  to 4.7
    },
    ratingsQuantity: {
      type: Number,
      default: 0
    },
    price: {
      type: Number,
      required: [true, 'A tour must have a price']
    },
    priceDiscount: {
      type: Number,
      // validate: {
      //     validator: function (val) {
      //         return val < this.price;
      //     },
      //     message: 'Discount price ({VALUE}) should be below regular price'
      // }
    },
    category: {
      type: String,
    },
    type: {
      type: String,
    },
    ageRange: {
      type: [String], //* kids, young adult,  adult,  
    },
    genderType: {
      type: [String], //* Male, Female, Others
    },
    summary: {
      type: String,
      trim: true,
    },
    description: {
      type: String,
      trim: true,
    },
    stock: {
      type: Number,
    },
    stockCity: {
      type: [String], //* Johannesburg, Captown, Durban
    },
    productWarranty: {
      type: Number, //* 0 to 6 months
    },
    size: {
      type: [String], //* xs, sm, md, lg, xl           
    },
    availability: {
      type: Boolean, //* available or not available
      default: true
    },
    colors: {
      type: [String], //* red, blue, green, yellow, white, black
    },
    barCode: {
      type: String,
    },
    itemWeight: {
      type: String, //* 0.634 ounces
    },
    ProductDimensions: {
      type: [String], //* 5.55 x 1.85 x 0.39 inches
    },
    manufacturer: {
      type: String, //* WISTON
    },
    productsImageCover: {
      type: String,
    },
    productsImages: [String],
    createdAt: {
      type: Date,
      default: Date.now(),
      select: false
    },
    bestSeller: {
      type: Boolean,
      default: false,
    },
    //* when the seller delete an item 
    deactivate: {
      type: Boolean,
      default: true,
      // select: false
    },
    Users: {
      type: mongoose.Schema.ObjectId,
      ref: "User"
    }

  },

  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);


productSchema.index({ price: 1, ratingsAverage: -1 });
productSchema.index({ slug: 1 });

productSchema.virtual('reviews', {
  ref: 'Review', // This is the Review table name
  foreignField: 'product',
  localField: '_id'
})


productSchema.pre("save", function (next) {
  this.slug = slugify(this.productName, { lower: true });
  next();
});

productSchema.post(/^find/, function (docs, next) {
  console.log(`Query took ${Date.now() - this.start} milliseconds!`);
  next();
});

productSchema.pre(/^find/, function (next) {
  this.populate({
    path: "Users",
    select: "-__v -passwordChangedAt",
  });
  next();
});

const Products = mongoose.model("Products", productSchema);
module.exports = Products;
