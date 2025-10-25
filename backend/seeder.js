const User = require("./src/models/User");
const { faker } = require("@faker-js/faker");
const Product = require("./src/models/Product");
const Transaction = require("./src/models/Transaction");
const Voucher = require("./src/models/Voucher");
const Review = require("./src/models/Review");
const { hashPassword } = require("./src/functions/passwordHasing");
const {
  connectDatabase,
  disconnectDatabase,
} = require("./src/database/database");

faker.seed(23);

//password semuanya password123
const createUser = async (role) => {
  console.log("Password semuanya password123");
  const hashedPassword = await hashPassword("password123");
  return {
    username: faker.internet.username(),
    name: faker.person.fullName(),
    email: faker.internet.email(),
    password: hashedPassword,
    no_telp: faker.phone.number("08##########"),
    alamat: faker.location.streetAddress(),
    role: role,
    cart: [],
  };
};

async function createProducts() {
  console.log("Membuat produk");
  const products = [
    {
      name: "Organic Garden Booster",
      kategori: "Pupuk",
      harga: 24.99,
      deskripsi: "Premium organic fertilizer for all garden plants.",
      stok: 17,
    },
    {
      name: "Sekop Taman Pro",
      kategori: "Alat",
      harga: 15.5,
      deskripsi: "Alat sekop tahan lama untuk kebutuhan berkebun.",
      stok: 8,
    },
    {
      name: "Bibit Tomat Cherry",
      kategori: "Bibit",
      harga: 5.99,
      deskripsi: "Bibit tomat cherry unggul, cepat berbuah.",
      stok: 50,
    },
    {
      name: "Pestisida Organik Neem", 
      kategori: "Pupuk",
      harga: 12.0,
      deskripsi: "Pestisida alami dari ekstrak daun neem.",
      stok: 0,
    },
  ];
  await Products.insertMany(products);
}

async function createVouchers() {
  console.log("Membuat voucher");
  const vouchers = [
    {
      kode: "HEMAT10",
      diskon: 10,
      tanggal_kadaluarsa: null,
    },
    {
      kode: "JANAGRO50",
      diskon: 50,
      tanggal_kadaluarsa: new Date("2026-12-31"),
    },
  ];
  await Vouchers.insertMany(vouchers);
}

async function seed() {
  try {
    await connectDatabase();
    await User.deleteMany({});
    await Product.deleteMany({});
    await Transaction.deleteMany({});
    await Voucher.deleteMany({});
    console.log("Table Users cleared");
    const adminUser = await createUser("admin");
    await User.create(adminUser);
    const PemilikUser = await createUser("pemilik");
    await User.create(PemilikUser);
    for (let i = 0; i < 10; i++) {
      const pengguna = await createUser("pengguna");
      console.log(pengguna);
      await User.create(pengguna);
    }
    await createProducts();
    await createVouchers();
    await Transaction.insertMany([]);
    await Review.insertMany([]);
    console.log("berhasil menambah users");
    console.log("berhasil menambah transactions");
    console.log("berhasil menambah products");
    console.log("Database seeder sukses!");
  } catch (error) {
    console.error("Seeder error: ", error);
    process.exit(1);
  } finally {
    await disconnectDatabase();
    console.log("Disconnected from MongoDB");
  }
}

seed();
