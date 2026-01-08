import axiosInstance from '@/lib/axios/axiosInstance';
import { Unit, CreateUnitRequest, UpdateUnitRequest } from '@/types/unit.types';

export const unitService = {

  // GET
  getAllUnits: async (): Promise<Unit[]> => {
    const response = await axiosInstance.get('/Units');
    return response.data;
  },

  // GET BY ID
  getUnitById: async (unitId: number): Promise<Unit> => {
    const response = await axiosInstance.get(`/Units/${unitId}`);
    return response.data;
  },

  // POST
  createUnit: async (data: CreateUnitRequest): Promise<Unit> => {

    const payload = {
      unitId: data.UnitId,
      unitName: data.UnitName,
      abbreviation: data.Abbreviation,
      createdBy: data.CreatedBy,
      createdAt: data.CreatedAt ?? new Date().toISOString(),
      modifiyBy: data.ModifiyBy ?? 0,
      modifiyAt: data.ModifiyAt ?? new Date().toISOString(),
    };

    const response = await axiosInstance.post('/Units', payload);
    return response.data;
  },

  // PUT
  updateUnit: async (id: number, data: UpdateUnitRequest): Promise<Unit> => {

    const payload = {
      unitId: data.UnitId,
      unitName: data.UnitName,
      abbreviation: data.Abbreviation,
      createdBy: data.CreatedBy,
      createdAt: data.CreatedAt,
      modifiyBy: data.ModifiyBy,
      modifiyAt: data.ModifiyAt ?? new Date().toISOString(),
    };

    const response = await axiosInstance.put(`/Units/${id}`, payload);
    return response.data;
  },

  // DELETE
  deleteUnit: async (id: number): Promise<void> => {
    await axiosInstance.delete(`/Units/${id}`);
  },
};