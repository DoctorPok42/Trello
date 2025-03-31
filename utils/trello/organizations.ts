const id = process.env.EXPO_PUBLIC_REACT_APP_ID;
const APIKey = process.env.EXPO_PUBLIC_REACT_APP_KEY;
const APIToken = process.env.EXPO_PUBLIC_REACT_APP_TOKEN;

export const createOrganization = async (displayName:string) => {
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

export const getOrganization = () => {
  let organization = null;
  const url = `https://api.trello.com/1/organizations/${id}?key=${APIKey}&token=${APIToken}`;
  const params = { method: "GET", headers: { Accept: "application/json" } };

  try {
    fetch(url, params)
      .then((response) => {
        console.log(`ORGA RESPONSE: ${response.status} ${response.statusText}`);
      })
      .catch((err) => {
        console.log(
          `Une erreur s'est produite lors de la crétion de la table: ${err}`
        );
      });
    console.log("ORG => " + organization);
    return organization;
  } catch (err) {
    return "Erreur [OGZ2] : " + err;
  }
};
