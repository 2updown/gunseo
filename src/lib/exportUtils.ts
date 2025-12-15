
import { Mapping } from '@/types';
import { UNITS } from './mockData';
import { useStore } from '@/store/useStore';

// Simple CSV Export
export function downloadCSV(mappings: Mapping[]) {
    const { atlSkills, atlCategories, atlClusters } = useStore.getState();

    // Header
    const headers = ['Skill Code', 'Category (En)', 'Category (Ko)', 'Cluster (En)', 'Cluster (Ko)', 'Description (En)', 'Description (Ko)', 'Grade', 'Unit No', 'UOI Name', 'Note'];

    // Rows
    const rows = mappings.map(m => {
        const skill = atlSkills.find(s => s.id === m.skillId);
        const unit = UNITS.find(u => u.id === m.unitId);
        const category = atlCategories.find(c => c.id === skill?.area);
        const cluster = atlClusters.find(c => c.id === skill?.clusterId);

        return [
            skill?.code || '',
            category?.labelEn || skill?.area || '',
            category?.labelKo || '',
            cluster?.labelEn || '',
            cluster?.labelKo || '',
            skill?.descriptionEn || '',
            skill?.descriptionKo || '',
            unit?.grade || '',
            unit?.unitNo || '',
            unit?.name || '',
            m.note || ''
        ].map(val => `"${val}"`); // Quote values to handle commas
    });

    const csvContent = [
        headers.join(','),
        ...rows.map(r => r.join(','))
    ].join('\n');

    const blob = new Blob(['\uFEFF' + csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);

    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `atl_mappings_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}
