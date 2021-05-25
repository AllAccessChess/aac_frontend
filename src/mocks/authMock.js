import mock from "../utils/mock";

const userData = {
  id: "12345",
  email: "demo@bootlab.io",
  name: "Lucy Lavender",
};

mock.onPost("/api/auth/login").reply((config) => {
  return { data: userData };
});

mock.onPost("/api/auth/sign-up").reply(() => {
  return { data: userData };
});

mock.onPost("/api/auth/reset-password").reply(() => {
  return { data: userData };
});
