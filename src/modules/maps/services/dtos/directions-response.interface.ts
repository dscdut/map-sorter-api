// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface IDirectionResponseData {
  routes?: any[];
  status: string;
}

export interface IDirectionsResponse {
  data: IDirectionResponseData;
}
