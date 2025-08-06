export interface ISessionData {
  telegram_id?: number;
  first_name?: string;
  age?: string;
  gender?: '0' | '1';
  location?: {
    type: 'Point';
    coordinates: [number, number];
  };
  photo_file_id?: string;
}
