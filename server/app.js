import "./configs/db.js";
import express from "express";
import routes from "./routes/user.routes.js"
const app = express();

app.use(express.json());

app.use("/api",routes)
app.listen(5000,"0.0.0.0", () => {
  console.log("Server Started");
});