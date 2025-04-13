class TrelloAPI {
  private readonly key: string;
  private token: string;
  private readonly baseUrl: string = "https://api.trello.com/1";
  private readonly minRequestDelay: number = 500;
  private readonly maxRequestDelay: number = 7000;

  constructor(key: string) {
    this.key = key;
    this.token = "";
  }

  public async setToken(token: string) {
    this.token = token;
  }

  public async getToken(): Promise<string> {
    if (!this.token) {
      throw new Error("Token not set. Please authenticate first.");
    }
    return this.token;
  }

  private createQueryParams(
    additionalParams: Record<string, any> = {}
  ): string {
    const params = { key: this.key, token: this.token, ...additionalParams };
    return new URLSearchParams(params).toString();
  }

  private async makeRequest(
    method: "GET" | "POST" | "PUT" | "DELETE",
    path: string,
    additionalParams: Record<string, any> = {},
    body?: any
  ): Promise<any> {
    const url = `${this.baseUrl}${path}?${this.createQueryParams(
      additionalParams
    )}`;
    const options: RequestInit = {
      method,
      headers: { "Content-Type": "application/json" },
    };
    if (body && (method === "POST" || method === "PUT")) {
      options.body = JSON.stringify(body);
    }

    let response = await fetch(url, options);

    // Gestion du rate limit (HTTP 429)
    if (response.status === 429) {
      const delay =
        Math.floor(
          Math.random() * (this.maxRequestDelay - this.minRequestDelay)
        ) + this.minRequestDelay;
      await new Promise((resolve) => setTimeout(resolve, delay));
      return this.makeRequest(method, path, body, additionalParams);
    }

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Erreur HTTP ${response.status}: ${errorText}`);
    }
    return response.json();
  }

  // ----------------- Board -----------------
  public async getBoards(memberId: string): Promise<any> {
    return this.makeRequest("GET", `/members/${memberId}/boards`);
  }

  public async createBoard(
    name: string,
    idOrganization: string,
    idBoardSource?: string
  ): Promise<any> {
    return this.makeRequest("POST", "/boards", {
      name,
      idOrganization,
      idBoardSource,
    });
  }

  public async renameBoard(boardId: string, name: string): Promise<any> {
    return this.makeRequest("PUT", `/boards/${boardId}`, { name });
  }

  public async deleteBoard(boardId: string): Promise<any> {
    return this.makeRequest("DELETE", `/boards/${boardId}`);
  }

  public async getBoardMembers(boardId: string): Promise<any> {
    return this.makeRequest("GET", `/boards/${boardId}/members`);
  }

  // ----------------- Card -----------------
  public async getCards(listId: string): Promise<any> {
    return this.makeRequest("GET", `/boards/${listId}/cards`);
  }

  public async getCard(cardId: string): Promise<any> {
    return this.makeRequest("GET", `/cards/${cardId}`);
  }

  public async updateCard(cardId: string, body: any): Promise<any> {
    return this.makeRequest("PUT", `/cards/${cardId}`, body);
  }

  public async deleteCard(cardId: string): Promise<any> {
    return this.makeRequest("DELETE", `/cards/${cardId}`);
  }

  public async createCard(listId: string, name: string): Promise<any> {
    const body = { name, idList: listId };
    return this.makeRequest("POST", `/cards`, body);
  }

  // ----------------- Workspace -----------------
  public async createWorkspace(name: string): Promise<any> {
    const body = { displayName: name };
    return this.makeRequest("POST", "/organizations", body);
  }

  public async getWorkspaces(memberId: string): Promise<any> {
    return this.makeRequest("GET", `/members/${memberId}/organizations`);
  }

  public async deleteWorkspace(workspaceId: string): Promise<any> {
    return this.makeRequest("DELETE", `/organizations/${workspaceId}`);
  }

  public async renameWorkspace(
    workspaceId: string,
    name: string
  ): Promise<any> {
    const body = { displayName: name };
    return this.makeRequest("PUT", `/organizations/${workspaceId}`, body);
  }

  // ----------------- List -----------------
  public async createList(boardId: string, name: string): Promise<any> {
    const body = { name, idBoard: boardId };
    return this.makeRequest("POST", `/lists`, body);
  }

  public async deleteList(listId: string): Promise<any> {
    return this.makeRequest("PUT", `/lists/${listId}/closed`, { value: true });
  }

  public async updateList(listId: string, name: string): Promise<any> {
    const body = { name };
    return this.makeRequest("PUT", `/lists/${listId}`, body);
  }

  public async getLists(boardId: string): Promise<any> {
    return this.makeRequest("GET", `/boards/${boardId}/lists`);
  }
}

export default TrelloAPI;
