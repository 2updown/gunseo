import { useStore } from '@/store/useStore';
import { UNITS } from '@/lib/mockData';
// Removed ATL_SKILLS import
import { useMemo, useState, Fragment } from 'react';
import clsx from 'clsx';
import { Grade } from '@/types';
import { Settings } from 'lucide-react';
import { SkillManager } from '@/components/admin/SkillManager';

export function MappingGrid() {
    const {
        selectedGrade, searchQuery, mappings,
        openPanel, selectedCell, atlSkills,
        atlCategories, atlClusters
    } = useStore();

    const [isSkillManagerOpen, setIsSkillManagerOpen] = useState(false);

    // Filter Units based on selection
    const visibleUnits = useMemo(() => {
        return UNITS.filter(unit => {
            if (selectedGrade !== 'ALL' && unit.grade !== selectedGrade) return false;
            return true;
        }).sort((a, b) => {
            if (a.grade !== b.grade) return a.grade - b.grade;
            return a.unitNo - b.unitNo;
        });
    }, [selectedGrade]);

    // Grouping for headers: Grade -> UOIs
    const groupedUnits = useMemo(() => {
        const groups: { grade: Grade; units: typeof UNITS }[] = [];
        const grades = selectedGrade === 'ALL' ? [1, 2, 3, 4, 5, 6] as Grade[] : [selectedGrade];

        grades.forEach(g => {
            const unitsInGrade = visibleUnits.filter(u => u.grade === g);
            if (unitsInGrade.length > 0) {
                groups.push({ grade: g, units: unitsInGrade });
            }
        });
        return groups;
    }, [visibleUnits, selectedGrade]);

    const filteredSkills = useMemo(() => {
        return atlSkills.filter(skill =>
            skill.descriptionEn?.toLowerCase().includes(searchQuery.toLowerCase()) ||
            skill.descriptionKo?.toLowerCase().includes(searchQuery.toLowerCase()) ||
            skill.code.toLowerCase().includes(searchQuery.toLowerCase())
        );
    }, [searchQuery, atlSkills]);

    // Grouping for rows: Category -> Cluster -> Skills
    const groupedData = useMemo(() => {
        // const { atlCategories, atlClusters, atlSkills } = useStore.getState(); // Removed direct state access
        const data: {
            category: typeof atlCategories[0];
            clusters: {
                cluster: typeof atlClusters[0];
                skills: typeof atlSkills
            }[];
            uncategorizedSkills: typeof atlSkills;
        }[] = [];

        atlCategories.forEach(cat => {
            const catClusters = atlClusters.filter(c => c.areaId === cat.id);
            const skillsInCat = filteredSkills.filter(s => s.area === cat.id);

            const clusterGroups: { cluster: typeof atlClusters[0]; skills: typeof atlSkills }[] = [];

            catClusters.forEach(cluster => {
                const skillsInCluster = skillsInCat.filter(s => s.clusterId === cluster.id);
                clusterGroups.push({ cluster, skills: skillsInCluster });
            });

            // Find skills in this category that don't belong to any cluster
            const skillsWithNoCluster = skillsInCat.filter(s => !s.clusterId || !catClusters.find(c => c.id === s.clusterId));

            if (clusterGroups.length > 0 || skillsWithNoCluster.length > 0) {
                data.push({
                    category: cat,
                    clusters: clusterGroups,
                    uncategorizedSkills: skillsWithNoCluster
                });
            }
        });

        // Global orphans (skills with invalid area)
        const orphanSkills = filteredSkills.filter(s => !atlCategories.find(c => c.id === s.area));

        return { data, orphanSkills };
    }, [filteredSkills, atlCategories, atlClusters, atlSkills]);

    return (
        <div className="flex-1 overflow-auto border-t border-gray-200 bg-white relative">
            {isSkillManagerOpen && <SkillManager onClose={() => setIsSkillManagerOpen(false)} />}

            <table className="border-collapse w-full relative">
                <thead>
                    {/* Row 1: Grade Header */}
                    <tr className="sticky top-0 z-30 bg-white shadow-sm h-10">
                        <th rowSpan={2} className="sticky left-0 top-0 z-40 bg-gray-50 border-r border-b border-gray-200 w-[480px] min-w-[480px] max-w-[480px]">
                            <div className="flex items-center justify-between px-4 h-full">
                                <span className="font-bold text-gray-700">ATL Skill Areas</span>
                                <div className="flex gap-2">
                                    <button
                                        onClick={() => setIsSkillManagerOpen(true)}
                                        className="p-1.5 hover:bg-gray-200 rounded-full text-gray-500 transition-colors"
                                        title="Manage Skills"
                                    >
                                        <Settings className="h-4 w-4" />
                                    </button>
                                </div>
                            </div>
                        </th>
                        {groupedUnits.map(group => (
                            <th
                                key={group.grade}
                                colSpan={group.units.length}
                                className="text-center border-b border-r border-gray-200 bg-gray-50 text-gray-700 font-bold text-sm py-2"
                            >
                                Grade {group.grade}
                            </th>
                        ))}
                    </tr>
                    {/* Row 2: UOI Header */}
                    <tr className="sticky top-10 z-20 bg-white shadow-sm h-10">
                        {/* First th removed as it is covered by rowSpan above */}
                        {groupedUnits.flatMap(group =>
                            group.units.map(unit => (
                                <th
                                    key={unit.id}
                                    className="border-b border-r border-gray-200 p-1 text-xs font-medium text-gray-600 w-14 min-w-[56px] h-full align-middle bg-white hover:bg-gray-50 transition-colors"
                                >
                                    <div className="flex flex-col h-full justify-center items-center gap-1">
                                        <span className="font-bold text-gray-800">UOI {unit.unitNo}</span>
                                    </div>
                                </th>
                            ))
                        )}
                    </tr>
                </thead>
                <tbody>
                    {groupedData.data.map(group => (
                        <Fragment key={group.category.id}>
                            {/* Category Header Row */}
                            <tr className="bg-blue-100 sticky top-[5rem] z-[15] shadow-sm transform">
                                <td colSpan={visibleUnits.length + 1} className="border-b border-blue-200 p-0">
                                    {/* Category Header */}
                                    <div
                                        className="bg-blue-100 h-14 px-4 flex items-center justify-between cursor-pointer hover:bg-blue-200/50 transition-colors"
                                    // onClick={() => toggleArea(group.category.id)}
                                    >
                                        <div className="flex items-baseline gap-2">
                                            <h3 className="font-bold text-blue-900 text-base">{group.category.labelKo}</h3>
                                            <span className="text-sm text-blue-700 font-medium">{group.category.labelEn}</span>
                                        </div>
                                    </div>
                                </td>
                            </tr>

                            {/* Clusters */}
                            {group.clusters.map(clusterGroup => (
                                <Fragment key={clusterGroup.cluster.id}>
                                    {/* Cluster Sub-Header Row */}
                                    <tr className="bg-yellow-50 sticky top-[8.5rem] z-[14] shadow-sm">
                                        <td colSpan={visibleUnits.length + 1} className="py-1 px-4">
                                            <div className="flex items-baseline gap-2">
                                                <span className="font-bold text-yellow-900 text-sm">{clusterGroup.cluster.labelKo}</span>
                                                <span className="text-xs text-yellow-700">{clusterGroup.cluster.labelEn}</span>
                                            </div>
                                        </td>
                                    </tr>

                                    {/* Skills in Cluster */}
                                    {clusterGroup.skills.map(skill => (
                                        <tr key={skill.id} className="hover:bg-gray-50 transition-colors group">
                                            <td className="sticky left-0 bg-white group-hover:bg-gray-50 z-10 p-2 border-r border-b border-gray-200 w-[600px] min-w-[600px]">
                                                <div className="flex items-start gap-2">
                                                    <span className="font-mono text-[10px] font-bold text-gray-400 bg-gray-100 px-1 rounded flex-shrink-0 mt-0.5">{skill.code}</span>
                                                    <div className="flex flex-col">
                                                        <span className="text-sm font-medium text-gray-800 leading-tight">{skill.descriptionKo}</span>
                                                        <span className="text-xs text-gray-500 leading-tight">{skill.descriptionEn}</span>
                                                    </div>
                                                </div>
                                            </td>
                                            {visibleUnits.map(unit => {
                                                const mapping = mappings.find(m => m.skillId === skill.id && m.unitId === unit.id);
                                                const isSelected = selectedCell?.skillId === skill.id && selectedCell?.unitId === unit.id;

                                                return (
                                                    <td
                                                        key={`${skill.id}-${unit.id}`}
                                                        className={clsx(
                                                            "border-r border-b border-gray-100 p-0 relative cursor-pointer transition-all h-full",
                                                            mapping ? "bg-blue-50 hover:bg-blue-100" : "hover:bg-gray-50",
                                                            isSelected ? "ring-2 ring-blue-500 z-10" : ""
                                                        )}
                                                        onClick={() => openPanel(skill.id, unit.id)}
                                                    >
                                                        {mapping && (
                                                            <div className="absolute inset-0 flex items-center justify-center">
                                                                <div className="w-3 h-3 bg-blue-500 rounded-full shadow-sm"></div>
                                                            </div>
                                                        )}
                                                    </td>
                                                );
                                            })}
                                        </tr>
                                    ))}
                                </Fragment>
                            ))}

                            {/* Uncategorized Skills (Directly under Category) */}
                            {group.uncategorizedSkills.map(skill => (
                                <tr key={skill.id} className="hover:bg-gray-50 transition-colors group">
                                    <td className="sticky left-0 bg-white group-hover:bg-gray-50 z-10 p-2 border-r border-b border-gray-200 w-[600px] min-w-[600px]">
                                        <div className="flex flex-col gap-0.5">
                                            <div className="flex items-center gap-2">
                                                <span className="font-mono text-[10px] font-bold text-gray-400 bg-gray-100 px-1 rounded flex-shrink-0">{skill.code}</span>
                                                <span className="text-sm font-medium text-gray-800 leading-tight">{skill.descriptionKo}</span>
                                            </div>
                                            <span className="text-xs text-gray-500 pl-9 leading-tight">{skill.descriptionEn}</span>
                                        </div>
                                    </td>
                                    {visibleUnits.map(unit => {
                                        const mapping = mappings.find(m => m.skillId === skill.id && m.unitId === unit.id);
                                        const isSelected = selectedCell?.skillId === skill.id && selectedCell?.unitId === unit.id;

                                        return (
                                            <td
                                                key={`${skill.id}-${unit.id}`}
                                                className={clsx(
                                                    "border-r border-b border-gray-100 p-0 relative cursor-pointer transition-all h-full",
                                                    mapping ? "bg-blue-50 hover:bg-blue-100" : "hover:bg-gray-50",
                                                    isSelected ? "ring-2 ring-blue-500 z-10" : ""
                                                )}
                                                onClick={() => openPanel(skill.id, unit.id)}
                                            >
                                                {mapping && (
                                                    <div className="absolute inset-0 flex items-center justify-center">
                                                        <div className="w-3 h-3 bg-blue-500 rounded-full shadow-sm"></div>
                                                    </div>
                                                )}
                                            </td>
                                        );
                                    })}
                                </tr>
                            ))}
                        </Fragment>
                    ))}

                    {/* Global Orphans */}
                    {groupedData.orphanSkills.length > 0 && (
                        <>
                            <tr className="bg-gray-100 sticky top-[5rem] z-10">
                                <td colSpan={visibleUnits.length + 1} className="p-2 border-b border-gray-300 font-bold text-gray-600">
                                    Other / Uncategorized
                                </td>
                            </tr>
                            {groupedData.orphanSkills.map(skill => (
                                <tr key={skill.id} className="hover:bg-gray-50 transition-colors group">
                                    <td className="sticky left-0 bg-white group-hover:bg-gray-50 z-10 p-2 border-r border-b border-gray-200 w-[600px] min-w-[600px]">
                                        <div className="flex items-start gap-2">
                                            <span className="font-mono text-[10px] font-bold text-gray-400 bg-gray-100 px-1 rounded flex-shrink-0 mt-0.5">{skill.code}</span>
                                            <div className="flex flex-col">
                                                <span className="text-sm font-medium text-gray-800 leading-tight">{skill.descriptionKo}</span>
                                                <span className="text-xs text-gray-500 leading-tight">{skill.descriptionEn}</span>
                                            </div>
                                        </div>
                                    </td>
                                    {visibleUnits.map(unit => {
                                        const mapping = mappings.find(m => m.skillId === skill.id && m.unitId === unit.id);
                                        const isSelected = selectedCell?.skillId === skill.id && selectedCell?.unitId === unit.id;
                                        return (
                                            <td key={`${skill.id}-${unit.id}`}
                                                className={clsx(
                                                    "border-r border-b border-gray-100 p-0 relative cursor-pointer transition-all h-full",
                                                    mapping ? "bg-blue-50 hover:bg-blue-100" : "hover:bg-gray-50",
                                                    isSelected ? "ring-2 ring-blue-500 z-10" : ""
                                                )}
                                                onClick={() => openPanel(skill.id, unit.id)}
                                            >
                                                {mapping && (
                                                    <div className="absolute inset-0 flex items-center justify-center">
                                                        <div className="w-3 h-3 bg-blue-500 rounded-full shadow-sm"></div>
                                                    </div>
                                                )}
                                            </td>
                                        );
                                    })}
                                </tr>
                            ))}
                        </>
                    )}
                </tbody>
            </table>
        </div>
    );
}
