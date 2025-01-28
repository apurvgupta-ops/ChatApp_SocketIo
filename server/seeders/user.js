import { User } from "../models/user.js";
import { faker } from "@faker-js/faker";
const createUser = async (numUsers) => {
  try {
    const userPromise = [];

    for (let i = 0; i < numUsers; i++) {
      const tempUser = User.create({
        name: faker.person.fullName(),
        userName: faker.internet.username(),
        bio: faker.lorem.sentence(10),
        password: "123456",
        avatar: {
          url: faker.image.avatar(),
          public_url: faker.system.fileName(),
        },
      });

      userPromise.push(tempUser);
    }

    await Promise.all(userPromise);
    console.log("userCreated", numUsers);
    process.exit(1);
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
};
export { createUser };
// createUser(10);
