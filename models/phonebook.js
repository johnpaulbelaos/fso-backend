const mongoose = require('mongoose');
require("node:dns/promises").setServers(["1.1.1.1", "8.8.8.8"]);

const url = process.env.MONGODB_URI;

mongoose.set('strictQuery',false);

mongoose.connect(url, { family: 4 })
  .then(result => {
    console.log('connected to MongoDB');
  })
  .catch(error => {
    console.log('error connecting to MongoDB:', error.message);
  });

function numberValidator (v) {
  return (/\d{2}-\d/.test(v) || /\d{3}-\d/.test(v));
}

const phonebookSchema = new mongoose.Schema({
  name: {
    type: String,
    minLength: 3,
    required: true,
  },
  number: {
    type: String,
    validate: {
      validator: numberValidator,
      message: props => `${props.value} is not a valid phone number!`
    }
  },
});

phonebookSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString();
    delete returnedObject._id;
    delete returnedObject.__v;
  }
});

module.exports = mongoose.model('Phonebook', phonebookSchema);

