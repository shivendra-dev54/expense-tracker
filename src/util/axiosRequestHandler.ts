import axios, { Method } from "axios";

export const axiosRequestHandler = async (
  url: string,
  type: Method,
  body: any
) => {
  const response = await axios({
    url: url,
    method: type,
    data: body
  });
  return response;
}