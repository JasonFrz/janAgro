const User = require("./src/models/User");
const { faker } = require("@faker-js/faker");
const Product = require("./src/models/Product");
const Voucher = require("./src/models/Voucher");
const Review = require("./src/models/Review");
const { hashPassword } = require("./src/functions/passwordHasing");
const {
  connectDatabase,
  disconnectDatabase,
} = require("./src/database/database");
const Checkout = require("./src/models/Checkout");
const Return = require("./src/models/Return");
faker.seed(23);
const Cancellation = require("./src/models/Cancellation");

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
    isBanned: false,
    avatar: null,
  };
};

async function createVouchers() {
  console.log("Membuat voucher");
  const vouchers = [
    {
      code: "HEMAT10",
      discountPercentage: 10,
      maxUses: 100,
      currentUses: 25,
      isActive: true,
    },
    {
      code: "JANAGRO50",
      discountPercentage: 50,
      maxUses: 20,
      currentUses: 19,
      isActive: true,
    },
    {
      code: "DISKONBARU",
      discountPercentage: 15,
      maxUses: 200,
      isActive: false, 
    },
  ];
  await Voucher.insertMany(vouchers);
}


   
async function createProducts() {
  console.log("Membuat produk");
  const products = [
    {
      name: "Organic Garden Booster",
      category: "Pupuk",
      price: 24.99,
      image: "🌱",
      description: "Premium organic fertilizer for all garden plants.",
      rating: 4.8,
      stock: 17,
      detail:
        "Pupuk organik premium untuk semua tanaman kebun, sangat bagus untuk meningkatkan kesuburan tanah dan hasil panen.",
    },
    {
      name: "Sekop Taman Pro",
      category: "Alat",
      price: 15.5,
      image: "🛠️",
      description: "Alat sekop tahan lama untuk kebutuhan berkebun.",
      rating: 4.5,
      stock: 8,
      detail:
        "Terbuat dari baja berkualitas tinggi, anti karat dan kokoh. Gagang ergonomis untuk kenyamanan maksimal.",
    },
    {
      name: "Bibit Tomat Cherry",
      category: "Bibit",
      price: 5.99,
      image: "🍅",
      description: "Bibit tomat cherry unggul, cepat berbuah.",
      rating: 4.9,
      stock: 50,
      detail:
        "Satu paket berisi 50 biji bibit tomat cherry pilihan. Tahan terhadap penyakit dan cocok untuk iklim tropis.",
    },
    {
      name: "Pestisida Organik Neem",
      category: "Pupuk",
      price: 12.0,
      image: "🌿",
      description: "Pestisida alami dari ekstrak daun neem.",
      rating: 4.6,
      stock: 0,
      detail:
        "Aman untuk tanaman dan lingkungan, efektif mengusir hama seperti kutu daun, ulat, dan tungau.",
    },
  ];
  await Product.insertMany(products);
}


async function seed() {
  try {
    await connectDatabase();
    await User.deleteMany({});
    await Product.deleteMany({});
    await Checkout.deleteMany({});
    await Voucher.deleteMany({});
    await Cancellation.deleteMany({});
    await Return.deleteMany({});
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
    await Checkout.insertMany([]);
    await Review.insertMany([]);
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
