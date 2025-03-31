const id = process.env.ID;
const key = process.env.KEY;
const token = process.env.TOKEN;

export const createOrganization = (name: string) => {
  const url = `https://api.trello.com/1/organizations/${id}?key=${key}&token=${token}`;
  const params = { method: "POST", headers: { Accept: "application/json" } };
  let res = false;

  fetch(url, params)
    .then((response) => {
        console.log("createOrganization response => " , response.status, response.statusText);
        res = true;
    })
    .then((text) => console.log(text))
    .catch((err) => { res = false });
    return res;
};

export const getOrganization = () => {
  let organization = null;
  const url = `https://api.trello.com/1/organizations/${id}?key=${key}&token=${token}`;
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