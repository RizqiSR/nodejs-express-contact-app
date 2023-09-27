const express = require("express");
const expressLayouts = require("express-ejs-layouts");
const {loadContact, findContact} = require('./utils/contacts')

const app = express();
const port = 3000;

//  Gunakan EJS: kasih tau kita pakai ejs -> secara default, ini sudah mendeteksi apakah sudah ada file view di dalam FOLDER VIEWS?
app.set("view engine", "ejs");
app.use(expressLayouts); // third party middleware
app.use(express.static("public")); // Built-in middleware

app.get("/", (req, res) => {
  /* 
  res.sendFile("./index.html", { root: __dirname }); // ini contoh tanpa pakai view engine EJS
  */
  res.render("index", {
    nama: "Rizqi Siti Rahmah",
    title: "NODEJS",
    mahasiswa,
    layout: 'layouts/main-layout'
  });
});

app.get("/about", (req, res) => {
  res.render("about", {
    layout: "layouts/main-layout",
    title: "Halaman About",
  });
});

// 1. Task 1: Load data contacts.json
app.get("/contact", (req, res) => {
  const contacts = loadContact()

  // untuk view
  res.render("contact", {
    layout: "layouts/main-layout",
    title: "Contact Page",
    contacts
  });
});

// Task 2: Fitur detail kontak berdasarkan nama
app.get("/contact/:nama", (req, res) => {
  const contact = findContact(req.params.nama)

  // untuk view
  res.render("detail", {
    layout: "layouts/main-layout",
    title: "Detail Page",
    contact
  });
});

// app.use: digunakan untuk menangani ketika halaman gaada
app.use("/", (req, res) => {
  res.status(404);
  res.send("<h1>404</h1>");
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
