import express from 'express';
import cors from "cors";
import formRoute from './Routes/Form/formRoutes.js';
import userRoute from './Routes/User/userRoutes.js'
import { connectDB } from './lib/db.js';

const app = express();
const port = 5000;

app.use(cors());
app.use(express.json());


app.use('/form', formRoute);
app.use('/auth', userRoute)

connectDB().then(() => {
    app.listen(port, () => console.log(`🚀 Server running on port ${port}`));
});