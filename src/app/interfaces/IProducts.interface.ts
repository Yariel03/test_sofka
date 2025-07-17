export interface ICreditCard {
  id: string;
  name: string;
  description: string;
  logo: string;
  date_release: string;
  date_revision: string;
}

export interface IResponse<T> {
  message?: string;
  data: T;
}
