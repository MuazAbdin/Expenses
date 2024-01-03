import * as dotenv from "dotenv";
dotenv.config();
import morgan from "morgan";
import express from "express";
import { connect } from "mongoose";
import api from "./server/routes/api.js";
import populateDB from "./populate.js";

const app = express();

app.use(morgan("dev"));
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

app.use("/expenses", api);

const PORT = process.env.PORT || 3000;
try {
  await connect(`${process.env.MONGO_URL}`);
  console.log("connected to DB successfully ...");
  // await populateDB();
  // console.log("DB is populated successfully ...");
  app.listen(PORT, () => {
    console.log(
      `server running on PORT ${PORT} ... <http://localhost:${PORT}/>`
    );
  });
} catch (error) {
  console.log(error);
  process.exit(1);
}
