const id = process.env.EXPO_PUBLIC_REACT_APP_ID;
const APIKey = process.env.EXPO_PUBLIC_REACT_APP_KEY;
const APIToken = process.env.EXPO_PUBLIC_REACT_APP_TOKEN;

export const createOrganization = async (displayName: string) => {
  const url = `https://api.trello.com/1/organizations?displayName=${displayName}&key=${APIKey}&token=${APIToken}`;
  const params = { method: "POST", headers: { Accept: "application/json" } };

  try {
    const response = await fetch(url, params);
    if (response.status === 200) return true;
    else return false;
  } catch (err) {
    console.log("[OGZ1] - ", err);
    return false;
  }
};

export const getOrganization = async () => {
  const url = `https://api.trello.com/1/members/me/organizations?key=${APIKey}&token=${APIToken}`;
  const params = { method: "GET", headers: { Accept: "application/json" } };

  try {
    const response = await fetch(url, params);
    const responseData = await response.json();
    if (response.status === 200) return responseData;
  } catch (err) {
    console.log("[OGZ2] - ", err);
    return false;
  }
};
