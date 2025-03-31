const id = process.env.ID;
const key = process.env.KEY;
const token = process.env.TOKEN;

export const createBoard = (name: string) => {
    const url = `https://api.trello.com/1/boards/?name=${name}&key=${key}&token=${token}`;
    const params = { method: "POST" };

    try {
        fetch(url, params)
        .then((response) => { if (response.status === 200) return true })
        .catch((err) => { console.log(`Une erreur s'est produite lors de la crétion de la table: ${err}`)});
        return true;
    } catch (err) {
        console.log("Erreur [A1] : " + err);
        return false;
    }
};


export const getBoards = () => {
    //const organizationId = getOrganization();
    const url = `https://api.trello.com/1/organizations/${id}/boards?key=${key}&token=${token}`;
    const params = { method: 'GET', headers: { 'Accept': 'application/json' }};

    try {
        fetch(url, params)
        .then(response => {
              console.log(
                `Response: ${response.status} ${response.statusText}`
              );
              return response.text();
            })
        .then(text => console.log(text))
        .catch(err => console.error(err));
    } catch (err){
        return "Erreur [A3] : " + err;
    }
}