const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const Users = require("./models/Users");
const multer = require('multer')
const PORT = process.env.PORT || "3000";

const app = express();
const storage= multer.diskStorage(
  {
    //destination for files
    destination: function(request, file, callback){
      callback(null, './public/uploads/images')
    },
    filename: function(request,file, callback){
      callback(null,Date.now()+file.originalname)
    }
  }
)

//uploads parameters for multer
const upload = multer({
  storage: storage,
  limits:{
    fieldSize: 1024*1024*3
  }
})

app.use(cors());
app.use(express.json());

start();

app.get("/users", async (req, res) => {
  try {
    let users = await Users.find({});
    return res.send(users);
  } catch (error) {
    return res.status(400).send(`Cannot load users - ${error.message}`);
  }
});

app.post("/users", upload.single('avatar'), async (req, res) => {
  try {
    const users = await Users({
      name: req.body.name,
      age: req.body.age,
      position: req.body.position,
      img: req.file?.filename??'avatar.png',
    });
    await users.save();
    return res.send({ message: "user was added" });
    } catch (error) {
    return res.status(400).send(`Cannot add user - ${error.message}`);
  }
});

app.delete("/users/:id", async (req, res) => {
  try {
    const id = req.params.id;
    await Users.findByIdAndDelete(id);
    return res.send({ message: "user was deleted" });
  } catch (error) {
    return res.status(400).send(`Not found user with id - ${error.message}`);
  }
});

app.put("/users/:id",upload.single('avatar'), async (req, res) => {
  try {
    const id = req.params.id;
    const user = await Users.findById(id);
    user.name = req.body.name;
    user.age = req.body.age;
    user.position = req.body.position;
    user.img= req.file?.filename??'avatar.png',

    await user.save();
    return res.send({ message: "user updated" });
  } catch (error) {
    return res.status(400).send(`Not found user with id - ${error.message}`);
  }
});

async function start() {
  try {
    await mongoose.connect(
      "mongodb+srv://jacob:yakov7832@cluster0.vfy1n.mongodb.net/users"
    );

    app.listen(PORT);
  } catch (error) {
    console.log(error.message)
  }
}
