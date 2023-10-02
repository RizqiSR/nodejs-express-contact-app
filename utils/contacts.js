const fs = require("fs");

const dirPath = "./data"; // Direktori (folder)
const filePath = "./data/contacts.json"; // File (berbentuk JSON) dalam Direktori "data"

if (!fs.existsSync(dirPath)) {
  fs.mkdirSync(dirPath);
  fs.writeFileSync(filePath, "[]", "utf-8");
}

// 1. Ambil semua data dari contacts.json : yang di return bentuknya JS object
const loadContacts = () => {
  const fileJSON = fs.readFileSync(filePath, "utf-8"); // output: string
  const contacts = JSON.parse(fileJSON); // output: JS object/array of object
  return contacts;
};

// 2. Cari kontak berdasarkan nama
const findContact = (nama) => {
  const contacts = loadContacts();
  const contact = contacts.find(
    (contact) => contact.nama.toLowerCase() === nama.toLowerCase()
  );
  return contact;
};

// 3. Menuliskan / Menimpa file contacts.json dengan data baru
// - tidak langsung ditambahkan, karena method ini akan digunakan di method lain untuk ubah, hapus, dll
const saveContacts = (contacts) => {
  fs.writeFileSync(filePath, JSON.stringify(contacts)); // masuk kesini, JS object contacts harus dalam bentuk string
};

// 4. Menambahkan data contact baru
const addContact = (contact) => {
  const contacts = loadContacts();
  contacts.push(contact);
  saveContacts(contacts);
};

// 5. Cek nama duplikat
const duplicateCheck = (nama) => {
  const contacts = loadContacts();
  return contacts.find((contact) => contact.nama === nama);
};

// 6. Hapus kontak berdasarkan nama
const deleteContact = (nama) => {
  const contacts = loadContacts();
  const filteredContacts = contacts.filter((contact) => contact.nama !== nama);
  saveContacts(filteredContacts);
};

// 7. Ubah contacts
const updateContacts = (newContact) => {
  const contacts = loadContacts();
  // Hilangkan kontak lama yang nama === oldNama
  const filteredContacts = contacts.filter(
    (contact) => contact.nama !== newContact.oldNama
  );
  delete newContact.oldNama;
  filteredContacts.push(newContact);
  saveContacts(filteredContacts);
};

module.exports = {
  loadContacts,
  findContact,
  addContact,
  duplicateCheck,
  deleteContact,
  updateContacts,
};
