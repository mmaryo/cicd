import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import userRoute from './routes/userRoute.js';
import authRoute from './routes/authRoute.js';
import gasStationRoute from './routes/gasStationRoute.js';

const server = express();



// if .env is empty , define value default for csont
const hostname = process.env.HOSTNAME || 'localhost';
const PORT = process.env.PORT || 3000;



server.use(bodyParser.urlencoded({
  extended: true
}));
server.use(bodyParser.json());

// management  cors to accept all origin for prod and test
const corsOptions = {
  origin: '*',
  optionsSuccessStatus: 200 // some legacy browsers (IE11, various SmartTVs) choke on 204
}
server.use(cors(corsOptions));


// make accessible config swagger 
server.use(express.static('swagger'));


userRoute(server);
authRoute(server);
gasStationRoute(server);

server.listen(PORT, hostname);


