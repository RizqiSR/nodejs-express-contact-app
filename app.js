const express = require("express");
const expressLayouts = require("express-ejs-layouts");
const {
  loadContacts,
  findContact,
  addContact,
  duplicateCheck,
} = require("./utils/contacts");
const { body, validationResult, check } = require("express-validator"); // body: untuk menangkap apa yang diisikan di form. validationResult: unutk menyimpan data validasinya

// Kumpulan module untuk fitur flash message ketika data berhasil ditambahkan: express-session, cookie-parser, connect-flash
const session = require('express-session')
const cookieParser = require('cookie-parser')
const flash = require('connect-flash')

const app = express();
const port = 3000;

//  Gunakan EJS: kasih tau kita pakai ejs -> secara default, ini sudah mendeteksi apakah sudah ada file view di dalam FOLDER VIEWS?
app.set("view engine", "ejs");
app.use(expressLayouts); // third party middleware
app.use(express.static("public")); // Built-in middleware
app.use(express.urlencoded({ extended: true })); // Built-in middleware

// Konfigurasi Flash
app.use(cookieParser('secret'))
app.use(session({
  cookie: {maxAge: 6000},
  secret: 'secret',
  resave: true,
  saveUninitialized: true
}))
app.use(flash())

app.get("/", (req, res) => {
  /* 
  res.sendFile("./index.html", { root: __dirname }); // ini contoh tanpa pakai view engine EJS
  */
  res.render("index", {
    nama: "Rizqi Siti Rahmah",
    title: "NODEJS",
    layout: "layouts/main-layout",
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
  const contacts = loadContacts();

  // untuk view
  res.render("contact", {
    layout: "layouts/main-layout",
    title: "Contact Page",
    contacts,
    msg: req.flash('msg') // disclaimer: hanya kode buatan sendiri. di res.render() sendiri udah ada msg untuk nangkap flash message yang kitga buat
  });
});

// Task 3: Fitur tambah data kontak
app.get("/contact/add", (req, res) => {
  res.render("add-contact", {
    title: "Form add contact",
    layout: "layouts/main-layout",
  });
});

// Task 4: Fitur proses data kontak dari form
// data dengan method="post" harus di parsing dulu pakai app.use(express.urlencoded())
// untuk menangkap data dengan method="post" => ada di req.body
app.post(
  "/contact",
  [
    // body('sesuaikan dengan name="" di <input>).custom(value dari form dengan method="post") => {}')
    body("nama").custom((value) => {
      const duplicate = duplicateCheck(value);
      if (duplicate) {
        throw new Error(`Nama ${value} sudah terdaftar!`); // kalau sudah 'Throw' sama dengan return false, tapi return false dengan pesan error (return false, supaya masuk ke const errors = validationResult(req))
      }
      return true;
    }),
    check("email", "Email tidak valid").isEmail(),
    check("nohp", "Nomor tidak valid").isMobilePhone("id-ID"),
  ],
  (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.render("add-contact", {
        title: "Add contact form",
        layout: "layouts/main-layout",
        errors: errors.array(),
      });
    } else {
      addContact(req.body);
      // Kirim flash message
      req.flash('msg', 'New contact has been added!') // kirim 'msg'-nya (lihat code: fm.2 => di route app.get('/contact))
      res.redirect("/contact");
    }
  }
);

// Task 2: Fitur detail kontak berdasarkan nama
app.get("/contact/:nama", (req, res) => {
  const contact = findContact(req.params.nama);

  // untuk view
  res.render("detail", {
    layout: "layouts/main-layout",
    title: "Detail Page",
    contact,
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
