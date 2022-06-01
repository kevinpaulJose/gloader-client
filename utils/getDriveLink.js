import { baseURL } from "./config";

export const getDriveLink = () => {};

export const generateAccessToken = async (refresh_token) => {
  fetch(
    `https://oauth2.googleapis.com/token?client_secret=${baseURL.client_secret}&grant_type=refresh_token&refresh_token=${refresh_token}&client_id=${baseURL.client_id}`,
    {
      method: "POST",
      headers: {
        Accept: "*/*",
      },
    }
  )
    .then((response) => response.json())
    .then((data) => {
      return data.access_token;
    });
};
