const id = process.env.EXPO_PUBLIC_REACT_APP_ID;
const APIKey = process.env.EXPO_PUBLIC_REACT_APP_KEY;
const APIToken = process.env.EXPO_PUBLIC_REACT_APP_TOKEN;

export const createListByBoardId = async (name: string, idBoard: string) => {
  const url = `https://api.trello.com/1/lists?name=${name}&idBoard=${idBoard}&key=${APIKey}&token=${APIToken}`;
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

export const getListsByBoardId = async (idBoard: string) => {
  const url = `https://api.trello.com/1/boards/${idBoard}/lists?key=${APIKey}&token=${APIToken}`;
  const params = { method: "GET" };

  try {
    const response = await fetch(url, params);
    const responseData = await response.json();
    return responseData;
  } catch (err) {
    return "Erreur [A2] : " + err;
  }
};

export const renameList = async (listId: string, name?: string) => {
  const url = `https://api.trello.com/1/lists/${listId}/name?key=${APIKey}&token=${APIToken}&value=${name}`;
  const params = { method: "PUT" };
  try {
    const response = await fetch(url, params);
    if (response.status === 200) return true;
    else return false;
  } catch (err) {
    console.log("Erreur [A3] : " + err);
    return false;
  }
};

export const getLists = async (allBoardsIds: any[]) => {
  const params = { method: "GET" };

  try {
    const fetchPromises = allBoardsIds.map((board) => {
      const boardId = String(board.id).replace(/"/g, "");
      const url = `https://api.trello.com/1/boards/${boardId}/lists?key=${APIKey}&token=${APIToken}`;
      return fetch(url, params).then((res) => res.json())
    })
    const listsArray = await Promise.all(fetchPromises);
    const allLists = listsArray.flat();
    return allLists
  } catch (err) {
    console.log("Erreur [A4] : " + err);
    return false;
  }
};

/* 
export const deleteList = async (listId: string) => {
  const url = `https://api.trello.com/1/lists?name=${name}&idBoard=${idBoard}&key=${APIKey}&token=${APIToken}`;
  const params = { method: "DELETE" };
  try {
    const response = await fetch(url, params);
    if (response.status === 200) return true;
    else return false;
  } catch (err) {
    console.log("Erreur [A1] : " + err);
    return false;
  }
}; */
