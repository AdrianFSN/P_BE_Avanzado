"use strict";
require("dotenv").config();

const readline = require("node:readline");
const connection = require("./lib/connectMongoose");
const { AdNodepop, UserNodepop } = require("./models");
const fs = require("fs");
const bcrypt = require("bcrypt");

main().catch((err) => console.log("Ha habido un error", err));

async function main() {
  await new Promise((resolve) => connection.once("open", resolve));

  const deleteDB = await askQuestion(
    "Are you sure you want to delete all the content in the Data Base? This action can not be restored (No) "
  );
  if (!deleteDB) {
    process.exit();
  }

  await initUsersNodepop();
  await initAdsNodepop();
  connection.close();
}

async function initAdsNodepop() {
  const jsonAdsList = fs.readFileSync("./data/adsList.json", "utf-8");
  const adsDataInList = JSON.parse(jsonAdsList);

  const deleted = await AdNodepop.deleteMany();
  console.log(`${deleted.deletedCount} ads have been deleted from the Data Base`);

  const inserted = await AdNodepop.insertMany(adsDataInList);

  console.log(`${inserted.length} ads have been added to the Data Base.`);
}

async function initUsersNodepop() {
  const jsonAdsList = fs.readFileSync("./data/usersList.json", "utf-8");
  const usersDataInList = JSON.parse(jsonAdsList);
  const usersDataInListHashedPass = await Promise.all(
    usersDataInList.map(async (item) => {
      const hashedPassword = await bcrypt.hash(item.password, 10);
      return {
        ...item,
        password: hashedPassword,
      };
    })
  );

  const deleted = await UserNodepop.deleteMany();
  console.log(`${deleted.deletedCount} users have been deleted from the Data Base`);

  const inserted = await UserNodepop.insertMany(usersDataInListHashedPass);
  console.log(`${inserted.length} users have been added to the Data Base.`);
}

function askQuestion(text) {
  return new Promise((resolve, reject) => {
    // conectar readline con la consola
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
