const faker = require("faker");
const { User } = require("./user.model");

async function seedUsers() {
  const users = [];
  for (let i = 0; i < 1000000; i++) {
    users.push({
      firstName: faker.name.firstName(),
      lastName: faker.name.lastName(),
      age: faker.datatype.number({ min: 18, max: 99 }),
      gender: faker.random.arrayElement(["male", "female"]),
      problems: faker.datatype.boolean(),
      createdAt: new Date(),
      updatedAt: new Date(),
    });
  }
  await User.bulkCreate(users);
  console.log("Users have been added!");
}

seedUsers().catch((err) => console.error(err));
