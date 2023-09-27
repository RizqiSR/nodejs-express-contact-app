const fs = require("fs");

const dirPath = "./data"; // Direktori (folder)
const filePath = "./data/contacts.json"; // File (berbentuk JSON) dalam Direktori "data"

if (!fs.existsSync(dirPath)) {
  fs.mkdirSync(dirPath);
  fs.writeFileSync(filePath, "[]", "utf-8");
}

// Ambil semua data dari contacts.json
const loadContact = () => {
  const fileJSON = fs.readFileSync(filePath, "utf-8"); // output: string
  const contacts = JSON.parse(fileJSON); // output: JS object/array of object
  return contacts;
};

// Cari kontak berdasarkan nama
const findContact = (nama) => {
  const contacts = loadContact()
  const contact = contacts.find(contact => contact.nama.toLowerCase() === nama.toLowerCase())
  return contact
}

module.exports = { loadContact, findContact };
