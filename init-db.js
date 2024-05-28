"use strict";
require("dotenv").config();

const readline = require("node:readline");
const connection = require("./lib/connectMongoose");
const { AdNodepop, UserNodepop } = require("./models");
const fs = require("fs");
const bcrypt = require("bcrypt");

const jsonData = fs.readFileSync("./data/data.json", "utf-8");
const data = JSON.parse(jsonData);
const usersEmails = data.users.map((item) => item.email);

//console.log("esto es usersEmail: ", usersEmails);

main().catch((err) => console.log("There was an error initializing the data base", err));

async function main() {
  await new Promise((resolve) => connection.once("open", resolve));

  const deleteDB = await askQuestion(
    "Are you sure you want to delete all the content in the data base? This action can not be restored (No) "
  );
  if (!deleteDB) {
    process.exit();
  }

  await initUsersNodepop();
  await initAdsNodepop();
  connection.close();
}

async function initAdsNodepop() {
  const deleted = await AdNodepop.deleteMany();
  console.log(`${deleted.deletedCount} ads have been deleted from the Data Base`);

  const adsWithOwner = await Promise.all(
    data.ads.map(async (item) => {
      const randomIndex = Math.floor(Math.random() * data.users.length);
      const asignedOwner = await UserNodepop.findOne({ email: usersEmails[randomIndex] });
      return {
        ...item,
        owner: asignedOwner._id,
      };
    })
  );

  const inserted = await AdNodepop.insertMany(adsWithOwner);

  console.log(`${inserted.length} ads have been added to the Data Base.`);
}

async function initUsersNodepop() {
  const hashPassDataUsers = await Promise.all(
    data.users.map(async (item) => {
      const hashedPassword = await bcrypt.hash(item.password, 10);
      return {
        ...item,
        password: hashedPassword,
      };
    })
  );

  const deleted = await UserNodepop.deleteMany();
  console.log(`${deleted.deletedCount} users have been deleted from the Data Base`);

  const inserted = await UserNodepop.insertMany(hashPassDataUsers);
  console.log(`${inserted.length} users have been added to the Data Base.`);
}

function askQuestion(text) {
  return new Promise((resolve, reject) => {
    const ifc = readline.createInterface({
      input: process.stdin,
      output: process.stdout,
    });
    ifc.question(text, (answer) => {
      ifc.close();
      resolve(answer.toLowerCase() === "yes");
    });
  });
}
