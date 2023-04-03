export const sendEmailToNewUser = async (email) => {
  await fetch("http://localhost:3000/api/email/newUser", {
    method: "POST",
    body: JSON.stringify({
      email: email,
    }),
  });
};
