const { sequelize } = require("./db");
const { User } = require("./");
const users = require("./seedData");
const bcrypt = require("bcrypt");

const SALT_COUNT = 10;
const seed = async () => {
  await sequelize.sync({ force: true }); // recreate db
  const hashedUsers = await Promise.all(
    users.map(async (user) => {
      return {
        username: user.username,
        password: await bcrypt.hash(user.password, SALT_COUNT),
      };
    })
  );

  await User.bulkCreate(hashedUsers);
  // await User.bulkCreate(users);
};

module.exports = seed;
