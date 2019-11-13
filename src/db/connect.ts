import mongoose from 'mongoose';

mongoose.connect('mongodb://localhost/forecasts', {
  useUnifiedTopology: true,
  useNewUrlParser: true
});

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
  console.log(`Mongodb connected!`);
});
