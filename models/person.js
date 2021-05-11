const mongoose = require("mongoose");
const uniqueValidator = require("mongoose-unique-validator");

const url = process.env.MONGODB_URI;

console.log("connecting to", url);

mongoose
  .connect(url, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
    useCreateIndex: true,
  })
  .then(() => {
    console.log("connected to MongoDB");
  })
  .catch((error) => {
    console.log("error connecting to MongoDB:", error.message);
  });

const personSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Name required"],
    unique: true,
    minlength: [3, "Name must be at least 3 characters long"],
  },
  number: {
    type: String,
    required: [true, "Number required"],
    minlength: [8, "Number must be at least 8 characters long"],
  },
});

personSchema
  .set("toJSON", {
    transform: (document, returnedObject) => {
      returnedObject.id = returnedObject._id.toString();
      delete returnedObject._id;
      delete returnedObject.__v;
    },
  })
  .plugin(uniqueValidator);

module.exports = mongoose.model("Person", personSchema);
