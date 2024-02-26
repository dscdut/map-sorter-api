// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface IDirectionResponseData {
  geocoded_waypoints?: any[];
  routes?: any[];
  status: string;
}

export interface IDirectionsResponse {
  data: IDirectionResponseData;
}
