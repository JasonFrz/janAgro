const mongoose = require("mongoose");
require("dotenv").config();
const bcrypt = require("bcrypt");
const Users = require("./src/models/Users");
const { faker } = require("@faker-js/faker");

const uri = process.env.MONGO_URI;
console.log(uri);

faker.seed(23);

async function connectDatabase() {
  await mongoose.connect(uri);
  console.log("Connected to MongoDB");
}

//password semuanya password123
const createUser = async (role) => {
  console.log("Password semuanya password123");
  const hashedPassword = await bcrypt.hash("password123", 10);
  return {
    name: faker.person.fullName(),
    email: faker.internet.email(),
    password: hashedPassword,
    no_telp: faker.phone.number("08##########"),
    alamat: faker.location.streetAddress(),
    role: role,
    cart: [],
  };
};

async function createProducts() {}

async function seed() {
  try {
    await connectDatabase();
    await Users.deleteMany({});
    console.log("Table Users cleared");
    const adminUser = await createUser("admin");
    await Users.create(adminUser);
    const PemilikUser = await createUser("pemilik");
    await Users.create(PemilikUser);
    for (let i = 0; i < 10; i++) {
      const pengguna = await createUser("pengguna");
      console.log(pengguna);
      await Users.create(pengguna);
    }
    console.log("Database seeder sukses!");
  } catch (error) {
    console.error("Seeder error: ", error);
    process.exit(1);
  } finally {
    await mongoose.disconnect();
    console.log("Disconnected from MongoDB");
  }
}

seed();
