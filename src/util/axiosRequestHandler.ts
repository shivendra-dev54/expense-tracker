import axios, { AxiosError, Method } from "axios";

export const axiosRequestHandler = async (
  url: string,
  type: Method,
  body: any,
  logout: () => void
) => {
  let response;
  try {
    response = await axios({
      url: url,
      method: type,
      data: body
    });
    return response;
  }
  catch (e) {
    try {
      await axios({
        url: "/api/auth/refresh",
        method: "POST",
        data: null
      });

      response = await axios({
        url: url,
        method: type,
        data: body
      });
      return response;
    }
    catch (er) {
      if ((er as AxiosError).response?.status === 498) {
        await axios({
          url: "/api/auth/logout",
          method: "POST",
          data: null
        });

        logout();
      }
    }
  }
}