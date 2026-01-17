export interface ReaderSettings {
  wpm: number;
  chunkSize: number; // Words per flash (usually 1)
  fontSize: number; // in rem
}

export enum AppState {
  INPUT = 'INPUT',
  READING = 'READING',
}
