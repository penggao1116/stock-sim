const mockAxios = {
  create: jest.fn(function () {
    // Return the same mockAxios object so that subsequent calls (e.g. axios.get) work
    return mockAxios;
  }),
  get: jest.fn(),
  post: jest.fn(),

};

export default mockAxios;
