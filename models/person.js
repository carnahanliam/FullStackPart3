const mongoose = require("mongoose");
const uniqueValidator = require("mongoose-unique-validator");

// if (process.argv.length < 3) {
//   console.log(
//     "Please provide the password as an argument: node mongo.js <password>"
//   );
//   process.exit(1);
// }

// const newName = process.argv[3];
// const newNumber = process.argv[4];

const url = process.env.MONGODB_URI;

console.log("connecting to", url);

mongoose
  .connect(url, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
    useCreateIndex: true,
  })
  .then((result) => {
    console.log("connected to MongoDB");
  })
  .catch((error) => {
    console.log("error connecting to MongoDB:", error.message);
  });

const personSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
    minlength: 3,
  },
  number: {
    type: String,
    required: true,
    minlength: 8,
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

// const Person = mongoose.model("Person", personSchema);

// const person = new Person({
//   name: newName,
//   number: newNumber,
// });

// if (process.argv.length > 3) {
//   person.save().then((result) => {
//     console.log(`added ${person.name} ${person.number} to phonebook`);
//     mongoose.connection.close();
//   });
// }

// if (process.argv.length === 3) {
//   Person.find({}).then((result) => {
//     console.log("phonebook:");
//     result.forEach((person) => {
//       console.log(person.name, person.number);
//     });
//     mongoose.connection.close();
//   });
// }

module.exports = mongoose.model("Person", personSchema);
