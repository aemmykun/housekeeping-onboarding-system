// Centralised API helper — all PMS frontend calls go through here
const API_BASE = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

const getHeaders = () => {
    const token = localStorage.getItem('token');
    return {
        'Content-Type': 'application/json',
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
    };
};

const handleResponse = async (res) => {
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Request failed');
    return data;
};

// ── Rooms ────────────────────────────────────────────────────────────────────
export const roomsApi = {
    getAll: () => fetch(`${API_BASE}/rooms`, { headers: getHeaders() }).then(handleResponse),
    getSummary: () => fetch(`${API_BASE}/rooms/summary`, { headers: getHeaders() }).then(handleResponse),
    getOne: (id) => fetch(`${API_BASE}/rooms/${id}`, { headers: getHeaders() }).then(handleResponse),
    create: (data) => fetch(`${API_BASE}/rooms`, { method: 'POST', headers: getHeaders(), body: JSON.stringify(data) }).then(handleResponse),
    updateStatus: (id, status) => fetch(`${API_BASE}/rooms/${id}/status`, { method: 'PATCH', headers: getHeaders(), body: JSON.stringify({ status }) }).then(handleResponse),
    assignStaff: (id, staffId) => fetch(`${API_BASE}/rooms/${id}/assign`, { method: 'PATCH', headers: getHeaders(), body: JSON.stringify({ staffId }) }).then(handleResponse),
    seed: () => fetch(`${API_BASE}/rooms/seed`, { method: 'POST', headers: getHeaders() }).then(handleResponse),
};

// ── Bookings ─────────────────────────────────────────────────────────────────
export const bookingsApi = {
    getAll: (status) => fetch(`${API_BASE}/bookings${status ? `?status=${status}` : ''}`, { headers: getHeaders() }).then(handleResponse),
    getToday: () => fetch(`${API_BASE}/bookings/today`, { headers: getHeaders() }).then(handleResponse),
    checkIn: (data) => fetch(`${API_BASE}/bookings`, { method: 'POST', headers: getHeaders(), body: JSON.stringify(data) }).then(handleResponse),
    checkOut: (id) => fetch(`${API_BASE}/bookings/${id}/checkout`, { method: 'PATCH', headers: getHeaders() }).then(handleResponse),
    cancel: (id) => fetch(`${API_BASE}/bookings/${id}`, { method: 'DELETE', headers: getHeaders() }).then(handleResponse),
};

// ── Tasks ─────────────────────────────────────────────────────────────────────
export const tasksApi = {
    getAll: (params = {}) => {
        const qs = new URLSearchParams(params).toString();
        return fetch(`${API_BASE}/tasks${qs ? `?${qs}` : ''}`, { headers: getHeaders() }).then(handleResponse);
    },
    create: (data) => fetch(`${API_BASE}/tasks`, { method: 'POST', headers: getHeaders(), body: JSON.stringify(data) }).then(handleResponse),
    start: (id) => fetch(`${API_BASE}/tasks/${id}/start`, { method: 'PATCH', headers: getHeaders() }).then(handleResponse),
    complete: (id) => fetch(`${API_BASE}/tasks/${id}/complete`, { method: 'PATCH', headers: getHeaders() }).then(handleResponse),
    assign: (id, staffId) => fetch(`${API_BASE}/tasks/${id}/assign`, { method: 'PATCH', headers: getHeaders(), body: JSON.stringify({ staffId }) }).then(handleResponse),
    delete: (id) => fetch(`${API_BASE}/tasks/${id}`, { method: 'DELETE', headers: getHeaders() }).then(handleResponse),
};

// ── Staff ─────────────────────────────────────────────────────────────────────
export const staffApi = {
    getAll: () => fetch(`${API_BASE}/staff`, { headers: getHeaders() }).then(handleResponse),
    getTasks: (id, date) => fetch(`${API_BASE}/staff/${id}/tasks${date ? `?date=${date}` : ''}`, { headers: getHeaders() }).then(handleResponse),
    getShifts: (params = {}) => {
        const qs = new URLSearchParams(params).toString();
        return fetch(`${API_BASE}/staff/shifts${qs ? `?${qs}` : ''}`, { headers: getHeaders() }).then(handleResponse);
    },
    createShift: (data) => fetch(`${API_BASE}/staff/shifts`, { method: 'POST', headers: getHeaders(), body: JSON.stringify(data) }).then(handleResponse),
    deleteShift: (id) => fetch(`${API_BASE}/staff/shifts/${id}`, { method: 'DELETE', headers: getHeaders() }).then(handleResponse),
    getPerformance: () => fetch(`${API_BASE}/staff/performance`, { headers: getHeaders() }).then(handleResponse),
};
