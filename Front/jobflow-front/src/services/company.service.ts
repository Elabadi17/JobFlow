import { api } from "../api/axios";

export const createCompany = (data: any) =>
api.post("/companies", data);

export const getCompanies = (page = 0, size = 10) =>
api.get(`/companies?page=${page}&size=${size}`);

export const getCompanyById = (id: string) =>
api.get(`/companies/${id}`);

export const updateCompany = (id: string, data: any) =>
api.put(`/companies/${id}`, data);

export const deleteCompany = (id: string) =>
api.delete(`/companies/${id}`);