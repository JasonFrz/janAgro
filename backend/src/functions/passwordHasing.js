const bcrypt = require("bcryptjs");

// Function to hash a password
const hashPassword = async (password) => {
  try {
    const salt = await bcrypt.genSalt(10); // Generate a salt
    const hashedPassword = await bcrypt.hash(password, salt); // Hash the password
    return hashedPassword;
  } catch (error) {
    throw new Error("Error hashing password");
  }
};

// Function to compare a password with a hash
const comparePassword = async (password, hashedPassword) => {
  try {
    // 'password' is the plain text from the user
    // 'hashedPassword' is the hash from the database
    const isMatch = await bcrypt.compare(password, hashedPassword);
    return isMatch;
  } catch (error) {
    throw new Error("Error comparing password");
  }
};

module.exports = {
  hashPassword,
  comparePassword,
};