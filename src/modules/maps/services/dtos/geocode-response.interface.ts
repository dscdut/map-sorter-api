// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface IGeocodeResponseData {
  location: {
    lat: number;
    lng: number;
  };
}

export interface IGeocodeResponse {
  data: IGeocodeResponseData;
}
