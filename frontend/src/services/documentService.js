import API from "./api";

const getToken = () => {
  return localStorage.getItem(
    "token"
  );
};

export const uploadDocument =
async (file) => {

  const formData =
  new FormData();

  formData.append(
    "file",
    file
  );

  const response =
  await API.post(
    "/docs/upload",
    formData,
    {
      headers: {
        Authorization:
          `Bearer ${getToken()}`,
      },
    }
  );

  return response.data;
};

export const getDocuments =
async () => {

  const response =
  await API.get(
    "/docs/my-docs",
    {
      headers: {
        Authorization:
          `Bearer ${getToken()}`,
      },
    }
  );

  return response.data;
};