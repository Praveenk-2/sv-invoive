// All Unit API operations
import axiosInstance from '@/lib/axios/axiosInstance';
import { Unit, CreateUnitRequest, UpdateUnitRequest } from '@/types/unit.types';

export const unitService = {
  // GET: Fetch all units
  // Endpoint: GET /api/Units
  getAllUnits: async (): Promise<Unit[]> => {
    const response = await axiosInstance.get<Unit[]>('/Units');
    return response.data;
  },

  // GET: Fetch single unit by ID (if endpoint exists)
  getUnitById: async (unitId: number): Promise<Unit> => {
    const response = await axiosInstance.get<Unit>(`/Units/${unitId}`);
    return response.data;
  },

  // POST: Create new unit
  // Endpoint: POST /api/Units
  createUnit: async (unitData: CreateUnitRequest): Promise<Unit> => {
    const response = await axiosInstance.post<Unit>('/Units', unitData);
    return response.data;
  },

  // PUT: Update unit
  // Endpoint: PUT /api/Units/{id}
  updateUnit: async (id: number, unitData: UpdateUnitRequest): Promise<Unit> => {
    const response = await axiosInstance.put<Unit>(`/Units/${id}`, unitData);
    return response.data;
  },

  // DELETE: Delete unit
  // Endpoint: DELETE /api/Units/{id}
  deleteUnit: async (id: number): Promise<void> => {
    await axiosInstance.delete(`/Units/${id}`);
  },
};