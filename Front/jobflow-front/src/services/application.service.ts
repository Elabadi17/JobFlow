import { api } from "../api/axios";

export const createApplication = (
data: any
) =>
api.post(
`/applications`,
data
);

export const getApplications = (
page = 0,
size = 10
) =>
api.get(
`/applications?page=${page}&size=${size}`
);

export const getUserApplications = (
userId: string,
page = 0,
size = 10
) =>
api.get(
`/applications/user/${userId}?page=${page}&size=${size}`
);

export const updateStatus = (id: string, status: string) =>
api.patch(`/applications/${id}/status?status=${status}`);

export const deleteApplication = (
id: string
) =>
api.delete(
`/applications/${id}`
);