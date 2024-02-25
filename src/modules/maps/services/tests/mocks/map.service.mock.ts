export const mockMapService = {
  geocode: jest.fn().mockReturnValue({
    data: {
      coordinates: {
        lat: 37.4224764,
        lng: -122.0842499,
      },
    },
  }),
};
