export const COMPLIANCE_DATA = [
    { id: "1", title: "Laporan RKL-RPL Semester 2 2025", agency: "KLHK", status: "Approved", dueDate: "2026-01-31" },
    { id: "2", title: "RKAB Tahunan 2026", agency: "ESDM", status: "Pending", dueDate: "2025-12-15" },
    { id: "3", title: "Triwulan III Pelaporan Limbah B3", agency: "KLHK", status: "Submitted", dueDate: "2025-10-15" },
];

export const WASTE_DATA = [
    { id: "W1", type: "Spent Catalyst", code: "A102d", weight: 2.5, unit: "ton", status: "Stored", category: "1" as const },
    { id: "W2", type: "Used Oil", code: "B105d", weight: 800, unit: "kg", status: "Stored", category: "2" as const },
    { id: "W3", type: "Contaminated Soil", code: "A108d", weight: 15, unit: "ton", status: "Transported", manifest: "MNF-00123", category: "1" as const },
];

export const WATER_QUALITY_LOGS = [
    { timestamp: "2025-05-20T08:00:00", ph: 7.2, cod: 120, bod: 45, tss: 30, status: "Normal" },
    { timestamp: "2025-05-20T12:00:00", ph: 8.5, cod: 180, bod: 60, tss: 50, status: "Warning" },
    { timestamp: "2025-05-20T16:00:00", ph: 7.1, cod: 110, bod: 40, tss: 25, status: "Normal" },
];

export const POPAL_CERTIFICATIONS = [
    { id: "C1", name: "Budi Santoso", cert: "POPAL Utama", expiry: "2027-08-20", status: "Active" },
    { id: "C2", name: "Siti Aminah", cert: "PPPA", expiry: "2025-12-05", status: "Expiring Soon" },
];

export const GHG_EMISSIONS = [
    { month: "Jan", tco2e: 450 },
    { month: "Feb", tco2e: 420 },
    { month: "Mar", tco2e: 480 },
    { month: "Apr", tco2e: 390 },
    { month: "May", tco2e: 510 },
    { month: "Jun", tco2e: 460 },
];

export const ISO_AUDITS = [
    { id: "A1", type: "External (SGS)", date: "2025-11-20", findings: 2, status: "Scheduled" },
    { id: "A2", type: "Internal", date: "2025-05-10", findings: 5, status: "Closed" },
];

export const AMDAL_MILESTONES = [
    { id: "M1", title: "KA-ANDAL Approval", status: "Completed", progress: 100 },
    { id: "M2", title: "ANDAL Technical Review", status: "In Progress", progress: 65 },
    { id: "M3", title: "SKKL Issuance", status: "Pending", progress: 0 },
];
