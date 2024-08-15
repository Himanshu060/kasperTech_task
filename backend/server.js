const express = require('express');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const gridRoutes = require('./routes/gridRoutes');
const cors = require('cors');

dotenv.config();
connectDB();

const app = express();
app.use(cors());
app.use(express.json());

app.use('/api/grids', gridRoutes);

const PORT = process.env.PORT || 4000;
app.listen(PORT, console.log(`Server running on port ${PORT}`));
