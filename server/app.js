import "./configs/db.js";
import express from "express";
import router from "./routes/user.routes.js"
const app = express();

app.use("/",router);
app.get("/", (req, res) => {
  res.send("Server running");
});

app.listen(5000,"0.0.0.0", () => {
  console.log("Server Started");
});