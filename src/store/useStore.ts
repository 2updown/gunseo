import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Mapping, Grade, ATLSkill, ATLCategory, ATLCluster } from '../types';
import { ATL_SKILLS, ATL_CLUSTERS } from '@/lib/mockData';

interface AppState {
    mappings: Mapping[];

    selectedGrade: Grade | 'ALL';
    selectedYear: number;
    searchQuery: string;

    setGrade: (grade: Grade | 'ALL') => void;
    setSearchQuery: (query: string) => void;

    // Panel State
    isPanelOpen: boolean;
    selectedCell: { skillId: string, unitId: string } | null;
    openPanel: (skillId: string, unitId: string) => void;
    closePanel: () => void;
    toggleMapping: (skillId: string, unitId: string, note?: string) => void;
    updateMappingNote: (skillId: string, unitId: string, note: string) => void;

    // Sidebar State
    isSidebarCollapsed: boolean;
    toggleSidebar: () => void;
    // ATL Skills (Editable)
    atlSkills: ATLSkill[];
    atlClusters: ATLCluster[];
    atlCategories: ATLCategory[];
    addSkill: (skill: ATLSkill) => void;
    updateSkill: (id: string, updates: Partial<ATLSkill>) => void;
    deleteSkill: (id: string) => void;

    addCluster: (cluster: ATLCluster) => void;
    updateCluster: (id: string, updates: Partial<ATLCluster>) => void;
    deleteCluster: (id: string) => void;

    updateCategory: (id: string, updates: Partial<ATLCategory>) => void;
}

const INITIAL_CATEGORIES: ATLCategory[] = [
    { id: 'Communication', labelEn: 'Communication', labelKo: '의사소통' },
    { id: 'Social', labelEn: 'Social', labelKo: '사회성' },
    { id: 'Self-management', labelEn: 'Self-management', labelKo: '자기관리' },
    { id: 'Research', labelEn: 'Research', labelKo: '조사' },
    { id: 'Thinking', labelEn: 'Thinking', labelKo: '사고' },
];

export const useStore = create<AppState>()(
    persist(
        (set) => ({
            mappings: [],
            // Initialize with data from mockData source
            atlSkills: ATL_SKILLS,
            atlClusters: ATL_CLUSTERS,
            atlCategories: INITIAL_CATEGORIES,
            selectedGrade: 'ALL',
            selectedYear: 2024,
            searchQuery: '',
            isPanelOpen: false,
            selectedCell: null,
            isSidebarCollapsed: false,

            toggleMapping: (skillId, unitId, note) => set((state) => {
                const exists = state.mappings.find(m => m.skillId === skillId && m.unitId === unitId);
                if (exists) {
                    return { mappings: state.mappings.filter(m => m.id !== exists.id) };
                }
                return {
                    mappings: [...state.mappings, {
                        id: `${skillId}-${unitId}-${Date.now()}`,
                        skillId,
                        unitId,
                        note,
                        createdAt: Date.now()
                    }]
                };
            }),

            updateMappingNote: (skillId, unitId, note) => set((state) => {
                return {
                    mappings: state.mappings.map(m =>
                        (m.skillId === skillId && m.unitId === unitId) ? { ...m, note } : m
                    )
                };
            }),

            // ATL Skill Actions
            addSkill: (skill) => set((state) => ({ atlSkills: [...state.atlSkills, skill] })),
            updateSkill: (id, updates) => set((state) => ({
                atlSkills: state.atlSkills.map(s => s.id === id ? { ...s, ...updates } : s)
            })),
            deleteSkill: (id) => set((state) => ({
                atlSkills: state.atlSkills.filter(s => s.id !== id),
                // Cleanup mappings for deleted skill to avoid orphans?
                mappings: state.mappings.filter(m => m.skillId !== id)
            })),

            // ATL Cluster Actions
            addCluster: (cluster) => set((state) => ({ atlClusters: [...state.atlClusters, cluster] })),
            updateCluster: (id, updates) => set((state) => ({
                atlClusters: state.atlClusters.map(c => c.id === id ? { ...c, ...updates } : c)
            })),
            deleteCluster: (id) => set((state) => ({
                atlClusters: state.atlClusters.filter(c => c.id !== id),
                // Optionally handle orphan skills - for now keep them or let UI handle it
                atlSkills: state.atlSkills.filter(s => s.clusterId !== id) // Cascade delete skills for safety? Or just leave them?
                // Let's cascade delete skills for now to keep it clean, as skills depend on context.
            })),

            updateCategory: (id, updates) => set((state) => ({
                atlCategories: state.atlCategories.map(c => c.id === id ? { ...c, ...updates } : c)
            })),

            setGrade: (grade) => set({ selectedGrade: grade }),
            setSearchQuery: (query) => set({ searchQuery: query }),

            openPanel: (skillId, unitId) => set({ isPanelOpen: true, selectedCell: { skillId, unitId } }),
            closePanel: () => set({ isPanelOpen: false, selectedCell: null }),

            toggleSidebar: () => set((state) => ({ isSidebarCollapsed: !state.isSidebarCollapsed })),
        }),
        {
            name: 'atl-storage',
            partialize: (state) => ({
                mappings: state.mappings,
                atlSkills: state.atlSkills, // Persist skills changes
                atlClusters: state.atlClusters, // Persist clusters
                atlCategories: state.atlCategories, // Persist categories
                isSidebarCollapsed: state.isSidebarCollapsed
            }),
        }
    )
);
