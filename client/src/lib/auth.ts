import { apiRequest } from "./queryClient";

export async function loginHospital(username: string, password: string) {
  const response = await apiRequest('POST', '/api/hospital/login', {
    username,
    password,
  });
  
  return response.json();
}

export async function loginSupplier(username: string, password: string) {
  const response = await apiRequest('POST', '/api/supplier/login', {
    username,
    password,
  });
  
  return response.json();
}

export async function registerHospital(userData: any) {
  const response = await apiRequest('POST', '/api/hospital/register', userData);
  return response.json();
}

export async function registerSupplier(userData: any) {
  const response = await apiRequest('POST', '/api/supplier/register', userData);
  return response.json();
}
