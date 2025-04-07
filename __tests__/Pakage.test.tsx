import TrelloAPI from '../trello_module';

global.fetch = require('jest-fetch-mock');

describe('TrelloAPI', () => {
  const fakeKey = 'fakeKey';
  const fakeToken = 'fakeToken';
  let api;

  beforeEach(() => {
    api = new TrelloAPI(fakeKey);
    api.setToken(fakeToken);
  });

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

    test('getBoards should call correct URL', async () => {
    fetch.mockResponseOnce(JSON.stringify([]));
    await api.getBoards('123');
    expect(fetch).toHaveBeenCalledWith(
      expect.stringContaining('/members/123/boards'),
      expect.objectContaining({ method: 'GET' })
    );
  });

  test('getCards should call correct endpoint', async () => {
    fetch.mockResponseOnce(JSON.stringify([]));
    await api.getCards('list123');
    expect(fetch).toHaveBeenCalledWith(
      expect.stringContaining('/boards/list123/cards'),
      expect.objectContaining({ method: 'GET' })
    );
  });

  test('getLists should call the correct GET request', async () => {
    fetch.mockResponseOnce(JSON.stringify([]));
    await api.getLists('board123');
    expect(fetch).toHaveBeenCalledWith(
      expect.stringContaining('/boards/board123/lists'),
      expect.objectContaining({ method: 'GET' })
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

  test('renameBoard should call the correct PUT request', async () => {
    fetch.mockResponseOnce(JSON.stringify({}));
    await api.renameBoard('board123', 'New Name');
    expect(fetch).toHaveBeenCalledWith(
      expect.stringContaining('/boards/board123'),
      expect.objectContaining({ method: 'PUT' })
    );
  });
})