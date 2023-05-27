const express = require("express");
require("dotenv").config();
const cors = require("cors");
const fs = require("fs");

const app = express();

app.use(express.json());
app.use(cors());

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.post("/freelancers", async (req, res) => {
  try {
    const {
      name,
      email,
      password,
      profession,
      skills,
      hourly_rate,
      profile_picture,
    } = req.body;
    let newuser = {
      name,
      email,
      password,
      profession,
      skills,
      hourly_rate,
      profile_picture,
      isBooked: false,
    };

    let Obj = fs.readFileSync("./db.json", { encoding: "utf-8" });
    Obj = JSON.parse(Obj);

    for (let i = 0; i < Obj.users.length; i++) {
      if (Obj.users[i].email == email) {
        return res.json({ msg: "Already registered" });
      }
    }

    let last = Obj.users[Obj.users.length - 1];
    let id = last.id + 1;
    newuser.id = id;

    Obj.users.push(newuser);

    fs.writeFileSync("./db.json", JSON.stringify(Obj));

    res.json({ msg: "Registered Sucessfully" });
  } catch (error) {
    console.log(error);
    res.json({ msg: "Server error", error });
  }
});

app.get("/freelancers", async (req, res) => {
  try {
    let Obj = fs.readFileSync("./db.json", { encoding: "utf-8" });
    Obj = JSON.parse(Obj);
    res.json({ msg: "Done", users: Obj.users });
  } catch (error) {
    console.log(error);
    res.json({ msg: "Server error", error });
  }
});

app.patch("/freelancers/hire/:id", async (req, res) => {
  try {
    let id = req.params.id;
    // let token = req.headers.authorization;

    // if(!token){
    //   return res.json({msg : "Unauthorized"})
    // }

    let Obj = fs.readFileSync("./db.json", { encoding: "utf-8" });
    Obj = JSON.parse(Obj);

    for (let i = 0; i < Obj.users.length; i++) {
      if (Obj.users[i].id == id) {
        Obj.users[i].isBooked = true;
        break;
      }
    }

    fs.writeFileSync("./db.json", JSON.stringify(Obj));
    res.json({ msg: "OK" });
  } catch (error) {
    console.log(error);
    res.json({ msg: "Server error", error });
  }
});

app.delete("/freelancers/delete/:id", async (req, res) => {
  try {
    let passedid = req.params.id;

    let Obj = fs.readFileSync("./db.json", { encoding: "utf-8" });
    Obj = JSON.parse(Obj);

    Obj.users = Obj.users.filter((item) => item.id != passedid);

    fs.writeFileSync("./db.json", JSON.stringify(Obj));
    res.json({ msg: "OK" });
  } catch (error) {
    console.log(error);
    res.json({ msg: "Server error", error });
  }
});

app.patch("/freelancers/edit/:id", async (req, res) => {
  try {
    let id = req.params.id;
    let payload = req.body;
    payload.isBooked = false;

    let Obj = fs.readFileSync("./db.json", { encoding: "utf-8" });
    Obj = JSON.parse(Obj);

    for (let i = 0; i < Obj.users.length; i++) {
      if (Obj.users[i].id == id) {
        Obj.users[i] = payload;
        break;
      }
    }

    fs.writeFileSync("./db.json", JSON.stringify(Obj));
    res.json({ msg: "OK" });
  } catch (error) {
    console.log(error);
    res.json({ msg: "Server error", error });
  }
});

app.get("/freelancers/search/:name", async (req, res) => {
  try {
    let passedname = req.params.name.trim();

    let Obj = fs.readFileSync("./db.json", { encoding: "utf-8" });
    Obj = JSON.parse(Obj);

    let send = [];

    for (let i = 0; i < Obj.users.length; i++) {
      if (Obj.users[i].name == passedname) {
        send = Obj.users[i];
        break;
      }
    }

    fs.writeFileSync("./db.json", JSON.stringify(Obj));
    res.json({ msg: "OK", user: send });
  } catch (error) {
    console.log(error);
    res.json({ msg: "Server error", error });
  }
});

app.get("/freelancers/stat", async (req, res) => {
  try {
    let passedname = req.params.name.trim();

    let Obj = fs.readFileSync("./db.json", { encoding: "utf-8" });
    Obj = JSON.parse(Obj);

    let st = Obj.users.filter((item) => item.profession == "Student");
    let wb = Obj.users.filter((item) => item.profession == "Student");
    let ds = Obj.users.filter((item) => item.profession == "Student");

    let fi = Obj.users.filter((item) => item.isBooked);

    let fn = Obj.users.filter((item) => item.isBooked == false);

    let obj = {
      resgisterd: Obj.users.length,
      students: st.length,
      web_developers: wb.length,
      graphic_designers: ds.length,
      avg_rate: 0,
      booked: fi.length,
      available: fn.length,
    };

    fs.writeFileSync("./db.json", JSON.stringify(Obj));
    res.json({ msg: "OK", data: obj });
  } catch (error) {
    console.log(error);
    res.json({ msg: "Server error", error });
  }
});

app.listen(4000, async () => {
  try {
    console.log(`Server is running at port ${4000}`);
  } catch (error) {
    console.log(error);
  }
});
