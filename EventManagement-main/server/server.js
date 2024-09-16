const express = require('express');
const { readdirSync } = require('fs');
const app = express();
require('dotenv').config();
const bodyParser = require('body-parser');
const dbConfig = require('./config/dbConfig');
const cors = require('cors');

const PORT = 5001;
const usersRoute = require('./routes/usersRoute');
const busesRoute = require('./routes/busesRoute');
const couponsRoute = require('./routes/couponsRoute');
const bookingsRoute = require('./routes/bookingsRoute');
const tourRoute = require('./routes/tourRoute');
const cloundinaryRoute = require('./routes/cloudinaryRoute.js');
const memoriesRoute = require('./routes/memoriesRoute');
const pin = require('./routes/pins');

const reviewRoute = require('./routes/reviewRoute');
const profileRoute = require('./routes/profile');

const employeeRoute = require('./routes/employeeRoute');
const teamRoutes = require('./routes/teamRoute.js');
const taskRoutes = require('./routes/taskRoute.js');
const workersRoute = require ('./routes/workersRoute.js')


app.use(bodyParser.urlencoded({ extended: true, parameterLimit: 100000, limit: '500mb' }));
app.use(
  express.json({
    limit: '50mb',
  })
);
app.use(cors());


// Route
app.use('/api/users', usersRoute);
app.use('/api/buses', busesRoute);
app.use('/api/coupons', couponsRoute);
app.use('/api/bookings', bookingsRoute);
app.use('/api/tour', tourRoute);
app.use('/api/memories', memoriesRoute);
app.use('/api/cloundinary', cloundinaryRoute);
app.use('/api/pins', pin);
app.use('/api/review', reviewRoute);
app.use('/api/profile', profileRoute);
app.use('/api/employees', employeeRoute);
app.use('/api/teams', teamRoutes);
app.use('/api/tasks', taskRoutes);
app.use('/api/workers',workersRoute)


app.use(express.json());

app.listen(PORT, () => {
  console.log('Server is running on port ' + PORT);
});
