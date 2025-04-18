import * as accountModel from "../models/AccountModel.js";

export const createNewsletter = async (req, res) => {
  const { content } = req.body;

  const userSubscribed = await accountModel.getAccountNewsletter();

  if (!userSubscribed) {
    return res
      .status(404)
      .json({ message: "No users subscribed to the newsletter" });
  }

  const newsletter = {
    content,
    date: new Date(),
  };

  userSubscribed.forEach((user) => {
    // Assuming you have a function to send the newsletter to each user
    // sendNewsletterToUser(user.email, newsletter);
    console.log("Sending newsletter to:", user.email);
  });

  console.log("Newsletter sent to all subscribed users:", newsletter);

  res.status(201).json(newsletter);
};
