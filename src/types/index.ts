export type Grade = 1 | 2 | 3 | 4 | 5 | 6;

export interface ATLSkill {
    id: string;
    code: string; // e.g., 'COMM-01'
    area: string; // e.g., 'Communication' (Values match ATLCategory.id)
    clusterId: string; // References ATLCluster.id
    descriptionEn: string;
    descriptionKo: string;
}

export interface ATLCluster {
    id: string;
    areaId: string; // Parent Category ID
    labelEn: string;
    labelKo: string;
}

export interface ATLCategory {
    id: string;
    labelEn: string;
    labelKo: string;
}

// export interface Subject {
//     id: string;
//     name: string;
//     color: string; // For heatmap/UI
// }
// Keeping it commented out for now in case of future use or just removing it.
// Actually I'll remove it to be clean.

export interface Unit {
    id: string;
    grade: Grade;
    unitNo: number;
    name: string;
    // Removed subjectId as UOIs are transdisciplinary in PYP
}

export interface Mapping {
    id: string;
    skillId: string;
    unitId: string;
    note?: string;
    createdAt: number;
}

export interface Student {
    id: string;
    name: string;
    grade: Grade;
    studentNumber: string;
}

