import express from "express";
import cors from "cors";

import routes from "./routes/index";
import cron from "node-cron";
import { scheduleCronJob } from "../utils/cronjob";
const interval = "0 */6 * * *"; // 12 Hours
// const interval = "*/10 * * * * *"; // 10 seconds

const app = express();
cron.schedule(interval, () => {
  scheduleCronJob();
});
app.use(
  cors({
    origin: "*",
    preflightContinue: false,
  })
);

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.raw());
app.use("/", routes);

export default app;
