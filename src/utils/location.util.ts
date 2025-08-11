import { ISessionData } from 'src/interfaces/session-manager.interface';

export function createGeoPoint(
  lat: number,
  lon: number,
): ISessionData['location'] {
  return {
    type: 'Point',
    coordinates: [lon, lat],
  };
}
