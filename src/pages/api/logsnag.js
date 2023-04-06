import { LogSnag } from "logsnag";

const handler = async (req, res) => {
  const logsnag = new LogSnag({
    token: process.env.LOGSNAG_TOKEN,
    project: process.env.LOGSNAG_PROJECT,
  });

  const body = JSON.parse(req.body);

  await logsnag.publish({
    channel: body.channel,
    event: body.event,
    description: body.description,
    icon: "🔥",
    notify: true,
    tags: body.tags,
  });

  res.status(200).json({ status: "Ok" });
};

export default handler;
