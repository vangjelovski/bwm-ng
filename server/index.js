const express = require ('express');
const mongoose = require('mongoose');
const config = require('./config/dev')
const Rental = require('./models/rental');
const FakeDb = require('./fake-db');

const rentalRoutes = require('./routes/rentals')

mongoose.connect(config.DB_URI).then(() => {
    const fakeDB = new FakeDb();
    fakeDB.seedDb();
});

const app = express();

app.use('/api/v1/rentals', rentalRoutes);

const PORT = process.env.PORT || 3001;

app.listen(PORT, function(){
    console.log('app is runing av')
});