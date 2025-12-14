// Define Unit types based on your database structure

export interface Unit {
  UnitId: number;
  UnitName: string;
  Abbreviation: string;
}

export interface CreateUnitRequest {
  UnitId: number;
  UnitName: string;
  Abbreviation: string;
}

export interface UpdateUnitRequest {
  UnitId: number;
  UnitName: string;
  Abbreviation: string;
}