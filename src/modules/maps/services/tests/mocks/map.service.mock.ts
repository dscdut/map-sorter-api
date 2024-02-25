export const mockMapService = {
  geocode: jest.fn().mockReturnValue({
    data: {
      location: {
        lat: 37.4224764,
        lng: -122.0842499,
      },
    },
  }),
};
