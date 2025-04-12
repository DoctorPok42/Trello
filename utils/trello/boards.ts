import store from "@/store";

const id = process.env.EXPO_PUBLIC_REACT_APP_ID;
const APIKey = process.env.EXPO_PUBLIC_REACT_APP_KEY;
const APIToken = process.env.EXPO_PUBLIC_REACT_APP_TOKEN;

export const createBoard = async (name: string) => {
  const url = `https://api.trello.com/1/boards/?name=${name}&key=${APIKey}&token=${APIToken}`;
  const params = { method: "POST" };

  try {
    const response = await fetch(url, params);
    if (response.status === 200) return true;
    else return false;
  } catch (err) {
    console.log("Erreur [A1] : " + err);
    return false;
  }
};

export const createBoardByOrganizationId = async (
  name: string,
  idOrganization: string
) => {
  const url = `https://api.trello.com/1/boards/?name=${name}&idOrganization=${idOrganization}&key=${APIKey}&token=${APIToken}`;
  const params = { method: "POST" };

  try {
    const response = await fetch(url, params);
    if (response.status === 200) return true;
    else return false;
  } catch (err) {
    console.log("Erreur [BM1] : " + err);
    return false;
  }
};

export const getBoardsByID = async (organizationId: string) => {
  const url = `https://api.trello.com/1/organizations/${organizationId}/boards?key=${APIKey}&token=${APIToken}`;
  const params = { method: "GET", headers: { Accept: "application/json" } };

  try {
    const response = await fetch(url, params);
    const responseData = await response.json();
    return responseData;
  } catch (err) {
    return "Erreur [BM2] : " + err;
  }
};

export const getBoards = async () => {
  const url = `https://api.trello.com/1/members/me/boards?key=${APIKey}&token=${APIToken}`;
  const params = { method: "GET", headers: { Accept: "application/json" } };

  try {
    const response = await fetch(url, params);
    const responseData = await response.json();
    return responseData;
  } catch (err) {
    return "Erreur [BM3] : " + err;
  }
};

export const deleteBoard = async (boardID: string) => {
  const url = `https://api.trello.com/1/boards/${boardID}?key=${APIKey}&token=${APIToken}`;
  const params = { method: "DELETE", headers: { Accept: "application/json" } };

  try {
    const response = await fetch(url, params);
    const responseData = await response.json();
    if (response.status === 200) return responseData;
  } catch (err) {
    console.log("[BM4] - ", err);
    return false;
  }
};
export const updateBoard = async (boardID: string, name?: string) => {
  const url = `https://api.trello.com/1/boards/${boardID}?key=${APIKey}&token=${APIToken}&name=${name}`;
  const params = { method: "PUT", headers: { Accept: "application/json" } };

  try {
    const response = await fetch(url, params);
    if (response.status === 200) return true;
    else return false;
  } catch (err) {
    console.log("[BM5] - ", err);
    return false;
  }
};
