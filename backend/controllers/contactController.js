import Contact from "../models/Contact.js";

export const sendMessage = async (req, res) => {
  const { name, email, subject, message } = req.body;

  const contact = await Contact.create({
    name,
    email,
    subject,
    message
  });

  res.json({
    message: "Message sent successfully",
    contact
  });
};
