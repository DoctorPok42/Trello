import TrelloAPI from '../trello_module';

global.fetch = require('jest-fetch-mock');

const fakeKey = 'fakeKey';
const fakeToken = 'fakeToken';
let api;

beforeAll(() => {
  api = new TrelloAPI(fakeKey);
  api.setToken(fakeToken);
});

describe('TrelloAPI', () => {
  test('getToken should throw if token is not set', async () => {
    const freshAPI = new TrelloAPI(fakeKey);
    await expect(freshAPI.getToken()).rejects.toThrow("Token not set");
  });

  test('getToken should return the token if set', async () => {
    const token = await api.getToken();
    expect(token).toBe(fakeToken);
  });

  test('makeRequest should throw an error on network failure', async () => {
    fetch.mockReject(new Error('Network Error'));
    await expect(api.makeRequest('GET', '/test')).rejects.toThrow('Network Error');
  });

  test("makeRequest should handle a body in POST requests", async () => {
    fetch.mockResponseOnce(JSON.stringify({ success: true }));
    const response = await api.makeRequest("POST", "/test", {}, { name: "Test" });
    expect(response).toEqual({ success: true });
  })

  test("makeRequest should handle rate limiting", async () => {
    fetch.mockResponseOnce("", { status: 429 });
    fetch.mockResponseOnce(JSON.stringify({ success: true }));
    const response = await api.makeRequest("GET", "/test").catch((error) => {
      expect(error.message).toBe("Erreur HTTP 429: ");
    });
    expect(response).toEqual({ success: true })
  }, 10000);

  test("makeRequest should handle non-200 responses", async () => {
    fetch.mockResponseOnce(JSON.stringify({ error: "Not Found" }), { status: 404 });
    await expect(api.makeRequest("GET", "/test")).rejects.toThrow("Erreur HTTP 404: ");
  });
})

// ----------------- Board -----------------
describe("Board API", () => {
  test('createBoard should call correct URL', async () => {
    fetch.mockResponseOnce(JSON.stringify({}));
    await api.createBoard('New Board', '123');
    expect(fetch).toHaveBeenCalledWith(
      expect.stringContaining('/boards'),
      expect.objectContaining({ method: 'POST' })
    );
  });

  test('getBoards should call correct URL', async () => {
    fetch.mockResponseOnce(JSON.stringify([]));
    await api.getBoards('123');
    expect(fetch).toHaveBeenCalledWith(
      expect.stringContaining('/members/123/boards'),
      expect.objectContaining({ method: 'GET' })
    );
  });

  test("getBoardMembers should call correct URL", async () => {
    fetch.mockResponseOnce(JSON.stringify([]));
    await api.getBoardMembers('board123');
    expect(fetch).toHaveBeenCalledWith(
      expect.stringContaining('/boards/board123/members'),
      expect.objectContaining({ method: 'GET' })
    );
  });

  test('renameBoard should call the correct PUT request', async () => {
    fetch.mockResponseOnce(JSON.stringify({}));
    await api.renameBoard('board123', 'New Name');
    expect(fetch).toHaveBeenCalledWith(
      expect.stringContaining('/boards/board123'),
      expect.objectContaining({ method: 'PUT' })
    );
  });

  test("deleteBoard should call the correct DELETE request", async () => {
    fetch.mockResponseOnce(JSON.stringify({}));
    await api.deleteBoard("board123");
    expect(fetch).toHaveBeenCalledWith(
      expect.stringContaining("/boards/board123"),
      expect.objectContaining({ method: "DELETE" })
    );
  })
});

// ----------------- Card -----------------
describe("Card API", () => {
  test('getCards should call correct endpoint', async () => {
    fetch.mockResponseOnce(JSON.stringify([]));
    await api.getCards('list123');
    expect(fetch).toHaveBeenCalledWith(
      expect.stringContaining('/boards/list123/cards'),
      expect.objectContaining({ method: 'GET' })
    );
  });

  test("getCard should call correct endpoint", async () => {
    fetch.mockResponseOnce(JSON.stringify({}));
    await api.getCard('card123');
    expect(fetch).toHaveBeenCalledWith(
      expect.stringContaining('/cards/card123'),
      expect.objectContaining({ method: 'GET' })
    );
  });

  test("updateCard should call the correct PUT request", async () => {
    fetch.mockResponseOnce(JSON.stringify({}));
    await api.updateCard("card123", { name: "Updated Card" });
    expect(fetch).toHaveBeenCalledWith(
      expect.stringContaining("/cards/card123"),
      expect.objectContaining({ method: "PUT" })
    );
  });

  test('createCard should call the correct POST request', async () => {
    fetch.mockResponseOnce(JSON.stringify({}));
    await api.createCard('list123', 'New Card', 'Description');
    expect(fetch).toHaveBeenCalledWith(
      expect.stringContaining('/cards'),
      expect.objectContaining({ method: 'POST' })
    );
  });

  test('deleteCard should call the correct DELETE request', async () => {
    fetch.mockResponseOnce(JSON.stringify({}));
    await api.deleteCard('card123');
    expect(fetch).toHaveBeenCalledWith(
      expect.stringContaining('/cards/card123'),
      expect.objectContaining({ method: 'DELETE' })
    );
  });
});

// ----------------- List -----------------
describe("List API", () => {
  test("createList should call the correct POST request", async () => {
    fetch.mockResponseOnce(JSON.stringify({}));
    await api.createList("board123", "New List");
    expect(fetch).toHaveBeenCalledWith(
      expect.stringContaining("/lists"),
      expect.objectContaining({ method: "POST" })
    );
  })

  test("getLists should call the correct GET request", async () => {
    fetch.mockResponseOnce(JSON.stringify({}));
    await api.getLists("board123");
    expect(fetch).toHaveBeenCalledWith(
      expect.stringContaining("/boards/board123/lists"),
      expect.objectContaining({ method: "GET" })
    );
  })

  test ("deleteList should call the correct PUT request", async () => {
    fetch.mockResponseOnce(JSON.stringify({}));
    await api.deleteList("list123");
    expect(fetch).toHaveBeenCalledWith(
      expect.stringContaining("/lists/list123"),
      expect.objectContaining({ method: "PUT" })
    );
  })

  test("updateList should call the correct PUT request", async () => {
    fetch.mockResponseOnce(JSON.stringify({}));
    await api.updateList("list123", "New Name");
    expect(fetch).toHaveBeenCalledWith(
      expect.stringContaining("/lists/list123"),
      expect.objectContaining({ method: "PUT" })
    );
  });
});

// ----------------- Workspace -----------------
describe("Workspace API", () => {
  test("createWorkspace should call the correct POST request", async () => {
    fetch.mockResponseOnce(JSON.stringify({}));
    await api.createWorkspace("New Workspace");
    expect(fetch).toHaveBeenCalledWith(
      expect.stringContaining("/organizations"),
      expect.objectContaining({ method: "POST" })
    );
  });

  test("getWorkspaces should call the correct GET request", async () => {
    fetch.mockResponseOnce(JSON.stringify([]));
    await api.getWorkspaces("member123");
    expect(fetch).toHaveBeenCalledWith(
      expect.stringContaining("/members/member123/organizations"),
      expect.objectContaining({ method: "GET" })
    );
  })

  test("deleteWorkspace should call the correct DELETE request", async () => {
    fetch.mockResponseOnce(JSON.stringify({}));
    await api.deleteWorkspace("workspace123");
    expect(fetch).toHaveBeenCalledWith(
      expect.stringContaining("/organizations/workspace123"),
      expect.objectContaining({ method: "DELETE" })
    );
  })

  test("renameWorkspace should call the correct PUT request", async () => {
    fetch.mockResponseOnce(JSON.stringify({}));
    await api.renameWorkspace("workspace123", "New Name");
    expect(fetch).toHaveBeenCalledWith(
      expect.stringContaining("/organizations/workspace123"),
      expect.objectContaining({ method: "PUT" })
    );
  });
})