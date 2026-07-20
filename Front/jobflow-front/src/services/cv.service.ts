import { api } from "../api/axios";

export const uploadCV = (
file: File,
label: string,
note: string
) => {

const formData = new FormData();

formData.append("file", file);

formData.append(
"data",
new Blob(
[
JSON.stringify({
label,
note
})
],
{ type: "application/json" }
)
);

return api.post("/cv", formData, {
headers: {
"Content-Type": "multipart/form-data"
}
});

};

export const getCVs = () =>
api.get("/cv");

export const getCVById = (id: string) =>
api.get(`/cv/${id}`);

export const deleteCV = (id: string) =>
api.delete(`/cv/${id}`);