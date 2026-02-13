const mongoose = require('mongoose');
require("node:dns/promises").setServers(["1.1.1.1", "8.8.8.8"]);

if (process.argv.length < 3) {
  console.log('give password as argument');
  process.exit(1);
}

const password = process.argv[2];

const url = `mongodb+srv://jpmbelaos_db_user:${password}@cluster0.1orxp9j.mongodb.net/phonebookApp?appName=Cluster0`;

mongoose.set('strictQuery',false);

mongoose.connect(url, { family: 4 });

const phonebookSchema = new mongoose.Schema({
  name: String,
  number: String,
});

const Phonebook = mongoose.model('Phonebook', phonebookSchema);

const phonebook = new Phonebook({
  name: process.argv[3],
  number: process.argv[4],
});

if (process.argv.length < 4) {
  console.log('phonebook:')
  Phonebook.find({}).then(result => {
    result.forEach(phonebook => {
      console.log(`${phonebook.name} ${phonebook.number}`);
    });
    mongoose.connection.close();
  });
} else {
  phonebook.save().then(result => {
    console.log(`added ${process.argv[3]} number ${process.argv[4]} to phonebook!`);
    mongoose.connection.close();
  });
}



