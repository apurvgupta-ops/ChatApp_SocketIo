import { User } from "../models/user.js";
import { Chat } from "../models/chat.js";
import { Message } from "../models/message.js";
import { faker, simpleFaker } from "@faker-js/faker";

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

const createSampleSingleChats = async (numChats) => {
  try {
    const users = await User.find().select("_id")
    const chats = []

    for (let i = 0; i < users.length; i++) {
      for (let j = i + 1; j < users.length; j++) {
        chats.push(
          Chat.create({
            name: faker.lorem.words(2),
            members: [users[i], users[j]]
          })
        )
      }
    }

    await Promise.all(chats)
    console.log("userCreated", numUsers);
    process.exit(1);
  }
  catch (error) {
    console.log(error)
    process.exit(1);
  }
}

const createSampleGroupsChat = async (numChats) => {
  try {
    const users = await User.find().select("_id")
    const groupChats = []

    for (let i = 0; i < numChats; i++) {
      const numMembers = simpleFaker.number.int({ min: 3, max: users.length })
      const members = []

      for (let j = 0; j < numMembers; j++) {
        const randomIndex = Math.floor(Math.random() * users.length)
        const randomUsers = users[randomIndex]
        if (!members.includes(randomUsers)) {
          members.push(randomUsers)
        }
        const chat = Chat.create({
          groupChat: true,
          name: faker.lorem.words(2),
          members,
          creator: members[0]
        })
        groupChats.push(chat)
      }
    }
    await Promise.all(groupChats)
    console.log("userCreated", numUsers);
    process.exit(1);
  } catch (error) {
    console.log(error)
    process.exit(1);
  }
}

const createMessages = async (numMessages) => {
  try {
    const users = await User.find().select("_id")
    const chat = await Chat.find().select("_id")

    const messages = []

    for (let i = 0; i < numMessages; i++) {
      const randomUser = users[Math.floor(Math.random() * users.length)]
      const randomChat = users[Math.floor(Math.random() * users.length)]

      messages.push(
        Message.create({
          chat: randomChat,
          sender: randomUser,
          content: faker.lorem.sentence()
        })
      )
    }
    await Promise.all(messages)
    console.log("messages", numMessages);
    process.exit(1);
  } catch (error) {
    console.log(error)
    process.exit(1);
  }
}

const createMessagesInChat = async (chatId, numMessages) => {
  try {
    const users = await User.find().select("_id")

    const messages = []

    for (let i = 0; i < numMessages; i++) {
      const randomUser = users[Math.floor(Math.random() * users.length)]

      messages.push(
        Message.create({
          chat: chatId,
          sender: randomUser,
          content: faker.lorem.sentence()
        })
      )
    }
    await Promise.all(messages)
    console.log("messages", numMessages);
    process.exit(1);
  } catch (error) {
    console.log(error)
    process.exit(1);
  }
}

export { createUser, createSampleSingleChats, createSampleGroupsChat, createMessages, createMessagesInChat };
