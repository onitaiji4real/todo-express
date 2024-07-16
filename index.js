const express = require("express");
const dotenv = require("dotenv");
const todosRouter = require("./routes/todos");
const app = express();
dotenv.config();
app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  console.log("Here");
  res.send("Hi");
});

app.use("/todos", todosRouter);

const port = process.env.PORT;
app.listen(port, () => {
  console.log(`app now listening on port: ${port}`);
});
