const express = require('express');
require('dotenv').config();
const cookieParser = require('cookie-parser');
const cors = require('cors');
const path = require('path');

const authJwt = require('./middleware/jwt');
const { connectDB } = require('./config/db.config.js');
const AuthRoutes = require('./routes/AuthRoutes.js');
const AdminRoutes = require('./routes/AdminRoutes.js');
const errorHandler = require('./middleware/error-handler.js');
const { MakeData } = require('./Superadmin.js');
const app = express();

app.use(
  cors({
    origin: process.env.FRONT_URL,
    credentials: true,
    optionsSuccessStatus: 200,
  })
);

app.use(
  '/public/uploads/profile',
  express.static(path.join(__dirname, '/public/uploads/profile'))
);

app.use(express.json());
app.use(cookieParser());
app.use(authJwt());
app.use(errorHandler);
app.use('/api/v1/auth', AuthRoutes);
app.use('/api/v1/admin', AdminRoutes);

// const server = app.listen(process.env.PORT, async() => {

//   const args = process.argv;
//     try {
//      await connectDB();
//       if(args[2] === 'Add_Data'){
//         await MakeData()
//       }
//       console.log(`Server started Successfully with PORT ${process.env.PORT}`);
//     } catch (error) {
//       console.log('Error', error);
//     }
//   });
//   server.setTimeout(3000);



const server = app.listen(process.env.PORT, async () => {
  const args = process.argv;
  try {
    await connectDB();
    if (args[2] === 'Add_Data') {
      await MakeData();

      setTimeout(() => {
        server.close((err) => {
          if (err) {
            console.error('Error closing server:', err);
            process.exit(1); 
          }
          console.log('Server has been stopped after adding data.');
          process.exit(0); 
        });
      }, 10000);
    }
    console.log(`Server started successfully on PORT ${process.env.PORT}`);
  } catch (error) {
    console.log('Error', error);
  }
});

server.setTimeout(3000);