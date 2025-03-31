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

export const getBoards = () => {
  //const organizationId = getOrganization();
  const url = `https://api.trello.com/1/organizations/${id}/boards?key=${APIKey}&token=${APIToken}`;
  const params = { method: "GET", headers: { Accept: "application/json" } };

  try {
    fetch(url, params)
      .then((response) => {
        console.log(`Response: ${response.status} ${response.statusText}`);
        return response.text();
      })
      .then((text) => console.log(text))
      .catch((err) => console.error(err));
  } catch (err) {
    return "Erreur [A3] : " + err;
  }
};
