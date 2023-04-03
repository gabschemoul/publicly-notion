export const sendEmailToNewUser = async (email) => {
  await fetch("https://app.publicly.so/api/email/newUser", {
    method: "POST",
    body: JSON.stringify({
      email: email,
    }),
  });
};
