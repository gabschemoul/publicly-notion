import mail from "@sendgrid/mail";

mail.setApiKey(process.env.SENDGRID_API_KEY);

const handler = async (req, res) => {
  const body = JSON.parse(req.body);

  const userData = {
    to: body.email,
    from: {
      name: "Gabriel from Publicly",
      email: "hey@indiegab.dev",
    },
    templateId: "d-49523795546345c9b10cb822512dca9c",
  };

  mail.send(userData);

  res.status(200).json({ status: "Ok" });
};

export default handler;
