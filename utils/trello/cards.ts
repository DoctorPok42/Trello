const id = process.env.EXPO_PUBLIC_REACT_APP_ID;
const APIKey = process.env.EXPO_PUBLIC_REACT_APP_KEY;
const APIToken = process.env.EXPO_PUBLIC_REACT_APP_TOKEN;

export const createCardInList = async (name: string, listId: string) => {
  const url = `https://api.trello.com/1/cards?name=${name}&idList=${listId}&key=${APIKey}&token=${APIToken}`;
  const params = { method: "POST"  ,headers: { 'Accept': 'application/json' }};

  try {
    const response = await fetch(url, params);
    console.log("Response : ", response.status, response.statusText)
    if (response.status === 200) return true;
    else return false;
  } catch (err) {
    console.log("Erreur [CCM1] : " + err);
    return false;
  }
};


//
export const getCardsFromList = async (listId: string) => {
  const url = `https://api.trello.com/1/lists/${listId}/cards?key=${APIKey}&token=${APIToken}`;
  const params = { method: "GET", headers: { Accept: "application/json" } };

  try {
    const response = await fetch(url, params);
    const responseData = await response.json();
    return responseData;
  } catch (err) {
    return "Erreur [CCM2] : " + err;
  }
};

/* 
export const createCardByBoardId = async (name: string, idBoard: string ) => {
  const url = `https://api.trello.com/1/boards/?name=${name}&idOrganization=${idOrganization}&key=${APIKey}&token=${APIToken}`;
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

export const getCardByBoardId = async (name: string, idBoard: string ) => {
  const url = `https://api.trello.com/1/boards/?name=${name}&idOrganization=${idOrganization}&key=${APIKey}&token=${APIToken}`;
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

 */