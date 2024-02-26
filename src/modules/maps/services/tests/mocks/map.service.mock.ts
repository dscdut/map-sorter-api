export const mockMapService = {
  geocode: jest.fn().mockReturnValue({
    data: {
      location: {
        lat: 37.4224764,
        lng: -122.0842499,
      },
    },
  }),
  directions: jest.fn().mockReturnValue({
    data: {
      geocoded_waypoints: [
        {
          geocoder_status: 'OK',
          place_id: 'ChIJ7cmZVrK3j4ARbMMDIJdJbuA',
          types: ['street_address'],
        },
        {
          geocoder_status: 'OK',
          place_id: 'ChIJtYuu0V264lQRQrfeQ5K5Oxw',
          types: ['establishment', 'point_of_interest', 'university'],
        },
      ],
      routes: [
        {
          bounds: {
            northeast: { lat: 37.422569, lng: -122.084379 },
            southwest: { lat: 37.422003, lng: -122.084927 },
          },
          copyright: 'Map data ©2022 Google',
          legs: [
            {
              distance: { text: '1.0 mi', value: 1609 },
              duration: { text: '6 mins', value: 360 },
              end_address: 'Mountain View, CA, USA',
              end_location: { lat: 37.4224764, lng: -122.0842499 },
              start_address:
                'Google Building 41, 1600 Amphitheatre Pkwy, Mountain View, CA 94043, USA',
              start_location: { lat: 37.422485, lng: -122.084248 },
              steps: [], // populate this array with Step objects as needed
              traffic_speed_entry: [],
              via_waypoint: [],
            },
          ],
          overview_polyline: 'a~l~Fjk~uOwHJy@P',
          summary: '1600 Amphitheatre Pkwy, Mountain View, CA 94043, USA',
          warnings: [],
          waypoint_order: [],
        },
      ],
      status: 'OK',
    },
  }),
};
