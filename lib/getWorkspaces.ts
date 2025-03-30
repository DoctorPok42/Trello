const getWorkspaces = async (
  trelloAPI: any,
  setWorkspaces: (value: any[]) => void,
  selectedWorkspace: string | null,
  setSelectedWorkspace: (value: string | null) => void,
  setBoards: (value: any[]) => void,
  islast: boolean = false
) => {
  try {
    const response = await trelloAPI.getWorkspaces("me");
    setWorkspaces(response);
    if (islast) setSelectedWorkspace(response[response.length - 1].id);
    else setSelectedWorkspace(selectedWorkspace || response[0].id);

    const responseBoards = await trelloAPI.getBoards("me");
    setBoards(responseBoards);
  } catch (err) {
    console.log(err.message || "Erreur inconnue");
  }
};

export default getWorkspaces;
