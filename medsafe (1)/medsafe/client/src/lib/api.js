// lib/api.js
import axios from "axios";

const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

const api = axios.create({
  baseURL: API_BASE,
});

export async function extractMedicine(imageFile, dosage) {
  const formData = new FormData();
  formData.append("image", imageFile);
  if (dosage) {
    formData.append("dosagePerDay", String(dosage.dosagePerDay));
    formData.append("dosageTimes", JSON.stringify(dosage.dosageTimes));
  }

  const response = await api.post("/extract-medicine", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });

  return response.data;
}

export async function listMedicines() {
  const response = await api.get("/medicines");
  return response.data;
}

export async function getMedicine(id) {
  const response = await api.get(`/medicine/${id}`);
  return response.data;
}

export async function createManualMedicine(data) {
  const response = await api.post("/medicines/manual", data);
  return response.data;
}

export async function updateMedicine(id, data) {
  const response = await api.put(`/medicine/${id}`, data);
  return response.data;
}

export async function deleteMedicine(id) {
  const response = await api.delete(`/medicine/${id}`);
  return response.data;
}

export async function checkInteractions(medicineIds) {
  const response = await api.post("/medicines/interactions", { medicineIds });
  return response.data;
}

export async function checkMedicineInteractions(medicineNames) {
  const response = await api.post("/medicine/check-interaction", {
    medicineNames,
  });
  return response.data;
}

export async function fetchNotifications(limit = 50) {
  const response = await api.get("/notifications", { params: { limit } });
  return response.data;
}

export async function markNotificationRead(id) {
  const response = await api.patch(`/notifications/${id}/read`);
  return response.data;
}

export async function markAllNotificationsRead() {
  const response = await api.post("/notifications/read-all");
  return response.data;
}