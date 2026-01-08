export interface Unit {
  UnitId: number;
  UnitName: string;
  Abbreviation: string;
  CreatedBy: number;
  CreatedAt: string;
  ModifiyBy: number;
  ModifiyAt: string;
}

export interface CreateUnitRequest {
  UnitId: number;
  UnitName: string;
  Abbreviation: string;
  CreatedBy: number;
  CreatedAt?: string;
  ModifiyBy?: number;
  ModifiyAt?: string;
}

export interface UpdateUnitRequest {
  UnitId: number;
  UnitName: string;
  Abbreviation: string;
  CreatedBy?: number;
  CreatedAt?: string;
  ModifiyBy: number;
  ModifiyAt?: string;
}
