// const express = require('express')
// const dbConnect = require('./dbConnect')
// const app = express()
// app.use(express.json())
// const path = require('path')
// const userRoute = require('./savingsRoute.js/usersRoute')
// const transactionsRoute = require('./savingsRoute.js/transactionsRoute')
// app.use('/api/users/' , userRoute)
// app.use('/api/transactions/' , transactionsRoute)

// const port =process.env.PORT || 5001



// app.listen(port, () => console.log(`Node JS Server started at port ${port}!`))


const express = require('express');
const dbConnect = require('./dbConnect');
const app = express();


app.use(express.json());

// Route imports
const userRoute = require('./routes/usersRoute');
const transactionsRoute = require('./routes/transactionsRoute');
const savingsRoute = require('./routes/savingsRoute'); 

// Use routes
app.use('/api/users', userRoute);
app.use('/api/transactions', transactionsRoute);
app.use('/api/savings', savingsRoute); 

// Server listener
const port = process.env.PORT || 5000;
app.listen(port, () => console.log(`Node JS Server started at port ${port}!`));

