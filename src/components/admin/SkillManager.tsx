"use client";

import { useStore } from '@/store/useStore';
import { useState } from 'react';
import { Plus, Trash2, Edit2, Check, X, ChevronDown, ChevronRight } from 'lucide-react';

export function SkillManager({ onClose }: { onClose: () => void }) {
    const { atlSkills, atlClusters, atlCategories, addSkill, updateSkill, deleteSkill, addCluster, updateCluster, deleteCluster, updateCategory } = useStore();
    const [editingId, setEditingId] = useState<string | null>(null);
    const [editingClusterId, setEditingClusterId] = useState<string | null>(null);
    const [editingCategoryId, setEditingCategoryId] = useState<string | null>(null);

    // For Category Editing
    const [editCatLabels, setEditCatLabels] = useState<{ en: string, ko: string } | null>(null);
    // For Cluster Editing
    const [editClusterLabels, setEditClusterLabels] = useState<{ en: string, ko: string } | null>(null);

    // New Item States
    const [newSkill, setNewSkill] = useState<{ clusterId: string; code: string; descriptionEn: string; descriptionKo: string } | null>(null);
    const [newCluster, setNewCluster] = useState<{ areaId: string; labelEn: string; labelKo: string } | null>(null);

    // Initialize expanded
    const [expandedAreas, setExpandedAreas] = useState<Set<string>>(new Set(atlCategories.map(c => c.id)));

    const toggleArea = (areaId: string) => {
        const next = new Set(expandedAreas);
        if (next.has(areaId)) next.delete(areaId);
        else next.add(areaId);
        setExpandedAreas(next);
    };

    // --- Category Actions ---
    const startEditCategory = (cat: { id: string, labelEn: string, labelKo: string }) => {
        setEditingCategoryId(cat.id);
        setEditCatLabels({ en: cat.labelEn, ko: cat.labelKo });
    };

    const saveEditCategory = () => {
        if (editingCategoryId && editCatLabels) {
            updateCategory(editingCategoryId, { labelEn: editCatLabels.en, labelKo: editCatLabels.ko });
            setEditingCategoryId(null);
            setEditCatLabels(null);
        }
    };

    // --- Cluster Actions ---
    const handleStartAddCluster = (areaId: string) => {
        setNewCluster({ areaId, labelEn: '', labelKo: '' });
        setExpandedAreas(prev => {
            const next = new Set(prev);
            next.add(areaId);
            return next;
        });
    };

    const handleSaveNewCluster = () => {
        if (!newCluster || (!newCluster.labelEn && !newCluster.labelKo)) return;
        addCluster({
            id: `cluster-${Date.now()}`,
            ...newCluster
        });
        setNewCluster(null);
    };

    const startEditCluster = (cluster: { id: string, labelEn: string, labelKo: string }) => {
        setEditingClusterId(cluster.id);
        setEditClusterLabels({ en: cluster.labelEn, ko: cluster.labelKo });
    };

    const saveEditCluster = () => {
        if (editingClusterId && editClusterLabels) {
            updateCluster(editingClusterId, { labelEn: editClusterLabels.en, labelKo: editClusterLabels.ko });
            setEditingClusterId(null);
            setEditClusterLabels(null);
        }
    };

    // --- Skill Actions ---
    const handleStartAddSkill = (clusterId: string, areaId: string) => {
        // Find skills belonging to this area to generate a unique code prefix
        const skillsInArea = atlSkills.filter(s => s.area === areaId);
        const count = skillsInArea.length + 1;
        const category = atlCategories.find(c => c.id === areaId);
        const codePrefix = (category?.labelEn || areaId).substring(0, 3).toUpperCase();

        setNewSkill({
            clusterId,
            code: `${codePrefix}-${String(count).padStart(2, '0')}`,
            descriptionEn: '',
            descriptionKo: ''
        });
    };

    const handleSaveNewSkill = (areaId: string) => {
        if (!newSkill || !newSkill.descriptionEn) return;
        addSkill({
            id: `skill-${Date.now()}`,
            area: areaId, // Skills still need to know their parent area for filtering
            ...newSkill
        });
        setNewSkill(null);
    };


    return (
        <div className="fixed inset-0 bg-black/50 z-[110] flex items-center justify-center p-4">
            <div className="bg-white rounded-xl shadow-2xl w-full max-w-5xl h-[85vh] flex flex-col overflow-hidden">
                <div className="p-6 border-b border-gray-100 flex items-center justify-between bg-gray-50">
                    <h2 className="text-xl font-bold text-gray-800">Manage ATL Skills</h2>
                    <button onClick={onClose} className="p-2 hover:bg-gray-200 rounded-full">
                        <X className="h-5 w-5 text-gray-500" />
                    </button>
                </div>

                <div className="flex-1 overflow-y-auto p-6 space-y-8">
                    {atlCategories.map(cat => {
                        const clusters = atlClusters.filter(c => c.areaId === cat.id);
                        const isExpanded = expandedAreas.has(cat.id);
                        const isEditingCat = editingCategoryId === cat.id;

                        return (
                            <div key={cat.id} className="border border-gray-200 rounded-lg overflow-hidden">
                                {/* Category Header */}
                                <div
                                    className="bg-blue-100 p-4 flex items-center justify-between cursor-pointer hover:bg-blue-200/50 transition-colors"
                                    onClick={() => toggleArea(cat.id)}
                                >
                                    <div className="flex items-center gap-2 flex-1">
                                        {isExpanded ? <ChevronDown className="h-5 w-5 text-blue-700" /> : <ChevronRight className="h-5 w-5 text-blue-700" />}

                                        {isEditingCat && editCatLabels ? (
                                            <div onClick={e => e.stopPropagation()} className="flex items-center gap-2 flex-1">
                                                <input value={editCatLabels.ko} onChange={e => setEditCatLabels({ ...editCatLabels, ko: e.target.value })} className="text-sm font-bold border rounded p-1" placeholder="Korean" />
                                                <input value={editCatLabels.en} onChange={e => setEditCatLabels({ ...editCatLabels, en: e.target.value })} className="text-sm border rounded p-1" placeholder="English" />
                                                <button onClick={saveEditCategory} className="text-green-600"><Check className="h-4 w-4" /></button>
                                                <button onClick={() => setEditingCategoryId(null)} className="text-gray-400"><X className="h-4 w-4" /></button>
                                            </div>
                                        ) : (
                                            <div className="flex items-center gap-2 group/cat">
                                                <h3 className="font-bold text-lg text-blue-900">{cat.labelKo}</h3>
                                                <span className="text-sm text-blue-700 font-medium">({cat.labelEn})</span>
                                                <button onClick={(e) => { e.stopPropagation(); startEditCategory(cat); }} className="text-blue-300 hover:text-blue-600 p-1 opacity-0 group-hover/cat:opacity-100 transition-opacity"><Edit2 className="h-3 w-3" /></button>
                                            </div>
                                        )}
                                    </div>
                                    <button
                                        onClick={(e) => { e.stopPropagation(); handleStartAddCluster(cat.id); }}
                                        className="text-xs bg-white border border-blue-200 hover:bg-blue-50 text-blue-700 font-medium px-3 py-1.5 rounded flex items-center gap-1 shadow-sm"
                                    >
                                        <Plus className="h-3 w-3" /> Add Cluster
                                    </button>
                                </div>

                                {isExpanded && (
                                    <div className="bg-white p-4 space-y-4">
                                        {/* New Cluster Form */}
                                        {newCluster?.areaId === cat.id && (
                                            <div className="flex gap-2 p-3 bg-yellow-50 rounded-md border border-yellow-100 items-center">
                                                <span className="text-sm font-bold text-yellow-700">New Cluster:</span>
                                                <input value={newCluster.labelKo} onChange={e => setNewCluster({ ...newCluster, labelKo: e.target.value })} className="flex-1 text-sm border rounded p-1" placeholder="Cluster Name (Korean)" autoFocus />
                                                <input value={newCluster.labelEn} onChange={e => setNewCluster({ ...newCluster, labelEn: e.target.value })} className="flex-1 text-sm border rounded p-1" placeholder="Cluster Name (English)" onKeyDown={e => e.key === 'Enter' && handleSaveNewCluster()} />
                                                <button onClick={handleSaveNewCluster} className="text-green-600"><Check className="h-4 w-4" /></button>
                                                <button onClick={() => setNewCluster(null)} className="text-gray-400"><X className="h-4 w-4" /></button>
                                            </div>
                                        )}

                                        {clusters.map(cluster => {
                                            const clusterSkills = atlSkills.filter(s => s.clusterId === cluster.id);
                                            const isEditingClust = editingClusterId === cluster.id;

                                            return (
                                                <div key={cluster.id} className="border border-gray-100 rounded-md overflow-hidden">
                                                    {/* Cluster Header */}
                                                    <div className="bg-yellow-50 p-3 px-4 border-b border-yellow-100 flex justify-between items-center group/clust">
                                                        {isEditingClust && editClusterLabels ? (
                                                            <div className="flex gap-2 flex-1">
                                                                <input value={editClusterLabels.ko} onChange={e => setEditClusterLabels({ ...editClusterLabels, ko: e.target.value })} className="text-sm font-bold border rounded p-1" />
                                                                <input value={editClusterLabels.en} onChange={e => setEditClusterLabels({ ...editClusterLabels, en: e.target.value })} className="text-sm border rounded p-1" />
                                                                <button onClick={saveEditCluster} className="text-green-600"><Check className="h-4 w-4" /></button>
                                                                <button onClick={() => setEditingClusterId(null)} className="text-gray-400"><X className="h-4 w-4" /></button>
                                                            </div>
                                                        ) : (
                                                            <div className="flex items-center gap-2">
                                                                {/* <div className="w-2 h-2 rounded-full bg-yellow-400"></div> */}
                                                                <span className="text-base font-bold text-yellow-900">{cluster.labelKo}</span>
                                                                <span className="text-sm text-yellow-700 font-medium">({cluster.labelEn})</span>
                                                                <div className="flex items-center gap-1 opacity-0 group-hover/clust:opacity-100 transition-opacity">
                                                                    <button onClick={() => startEditCluster(cluster)} className="text-yellow-400 hover:text-blue-600 p-1"><Edit2 className="h-3 w-3" /></button>
                                                                    <button
                                                                        onClick={() => { if (confirm('Are you sure you want to delete this cluster and all its skills?')) deleteCluster(cluster.id); }}
                                                                        className="text-yellow-400 hover:text-red-500 p-1"
                                                                    >
                                                                        <Trash2 className="h-3 w-3" />
                                                                    </button>
                                                                </div>
                                                            </div>
                                                        )}
                                                        <button
                                                            onClick={() => handleStartAddSkill(cluster.id, cat.id)}
                                                            className="text-xs bg-white border border-yellow-200 hover:bg-yellow-100 text-yellow-800 px-2 py-1 rounded flex items-center gap-1 transition-colors shadow-sm"
                                                        >
                                                            <Plus className="h-3 w-3" /> Add Skill
                                                        </button>
                                                    </div>

                                                    {/* New Skill Form for Cluster */}
                                                    {newSkill?.clusterId === cluster.id && (
                                                        <div className="p-3 bg-blue-50 flex gap-2 items-start border-b border-blue-100">
                                                            <input value={newSkill.code} onChange={e => setNewSkill({ ...newSkill, code: e.target.value })} className="w-20 text-xs font-mono border rounded p-1" placeholder="Code" />
                                                            <div className="flex-1 space-y-1">
                                                                <input value={newSkill.descriptionKo} onChange={e => setNewSkill({ ...newSkill, descriptionKo: e.target.value })} className="w-full text-sm border rounded p-1" placeholder="Korean Description" autoFocus />
                                                                <input value={newSkill.descriptionEn} onChange={e => setNewSkill({ ...newSkill, descriptionEn: e.target.value })} className="w-full text-xs border rounded p-1" placeholder="English Description" onKeyDown={e => e.key === 'Enter' && handleSaveNewSkill(cat.id)} />
                                                            </div>
                                                            <button onClick={() => handleSaveNewSkill(cat.id)} className="text-green-600 p-1"><Check className="h-4 w-4" /></button>
                                                            <button onClick={() => setNewSkill(null)} className="text-gray-400 p-1"><X className="h-4 w-4" /></button>
                                                        </div>
                                                    )}

                                                    {/* Skills List */}
                                                    <div className="divide-y divide-gray-50">
                                                        {clusterSkills.map(skill => (
                                                            <div key={skill.id} className="p-2 pl-6 flex gap-3 group/skill hover:bg-gray-50 items-start">
                                                                {editingId === skill.id ? (
                                                                    <>
                                                                        <input id={`code-${skill.id}`} defaultValue={skill.code} className="w-20 text-xs font-mono border rounded p-1" />
                                                                        <div className="flex-1 space-y-1">
                                                                            <select id={`cluster-${skill.id}`} defaultValue={skill.clusterId || ''} className="w-full text-xs border rounded p-1 mb-1 bg-yellow-50/50">
                                                                                <option value="">(Unassigned)</option>
                                                                                {atlClusters.filter(c => c.areaId === cat.id).map(c => (
                                                                                    <option key={c.id} value={c.id}>{c.labelKo} / {c.labelEn}</option>
                                                                                ))}
                                                                            </select>
                                                                            <input id={`ko-${skill.id}`} defaultValue={skill.descriptionKo} className="w-full text-sm border rounded p-1" placeholder="Korean" />
                                                                            <input id={`en-${skill.id}`} defaultValue={skill.descriptionEn} className="w-full text-xs border rounded p-1" placeholder="English" />
                                                                        </div>
                                                                        <button
                                                                            onClick={() => {
                                                                                const code = (document.getElementById(`code-${skill.id}`) as HTMLInputElement).value;
                                                                                const ko = (document.getElementById(`ko-${skill.id}`) as HTMLInputElement).value;
                                                                                const en = (document.getElementById(`en-${skill.id}`) as HTMLInputElement).value;
                                                                                const clusterId = (document.getElementById(`cluster-${skill.id}`) as HTMLSelectElement).value;
                                                                                updateSkill(skill.id, { code, descriptionKo: ko, descriptionEn: en, clusterId: clusterId || undefined });
                                                                                setEditingId(null);
                                                                            }}
                                                                            className="text-green-600 p-1"
                                                                        ><Check className="h-4 w-4" /></button>
                                                                        <button onClick={() => setEditingId(null)} className="text-gray-400 p-1"><X className="h-4 w-4" /></button>
                                                                    </>
                                                                ) : (
                                                                    <>
                                                                        <span className="font-mono text-xs font-bold text-gray-400 bg-gray-100 px-1 rounded pt-0.5">{skill.code}</span>
                                                                        <div className="flex-1">
                                                                            <div className="text-sm text-gray-800">{skill.descriptionKo}</div>
                                                                            <div className="text-xs text-gray-500">{skill.descriptionEn}</div>
                                                                        </div>
                                                                        <div className="flex gap-1">
                                                                            <button onClick={() => setEditingId(skill.id)} className="text-gray-300 hover:text-blue-600 p-1"><Edit2 className="h-3 w-3" /></button>
                                                                            <button onClick={() => { if (confirm('Are you sure you want to delete this skill?')) deleteSkill(skill.id); }} className="text-red-300 hover:text-red-500 p-1"><Trash2 className="h-3 w-3" /></button>
                                                                        </div>
                                                                    </>
                                                                )}
                                                            </div>
                                                        ))}
                                                    </div>
                                                </div>
                                            );
                                        })}

                                        {/* Unclustered Skills Section for this Category */}
                                        {(() => {
                                            const unclusteredSkills = atlSkills.filter(s => s.area === cat.id && !s.clusterId);
                                            if (unclusteredSkills.length === 0) return null;

                                            return (
                                                <div className="bg-gray-50 p-4 border-t border-gray-200 mt-4 rounded-md">
                                                    <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Unclustered Skills</h4>
                                                    <div className="divide-y divide-gray-200 bg-white rounded-md border border-gray-200">
                                                        {unclusteredSkills.map(skill => (
                                                            <div key={skill.id} className="p-2 pl-6 flex gap-3 group/skill hover:bg-gray-50 items-start">
                                                                {editingId === skill.id ? (
                                                                    <>
                                                                        <input id={`code-${skill.id}`} defaultValue={skill.code} className="w-20 text-xs font-mono border rounded p-1" />
                                                                        <div className="flex-1 space-y-1">
                                                                            <select id={`cluster-${skill.id}`} defaultValue={skill.clusterId || ''} className="w-full text-xs border rounded p-1 mb-1 bg-yellow-50/50">
                                                                                <option value="">(Unassigned)</option>
                                                                                {atlClusters.filter(c => c.areaId === cat.id).map(c => (
                                                                                    <option key={c.id} value={c.id}>{c.labelKo} / {c.labelEn}</option>
                                                                                ))}
                                                                            </select>
                                                                            <input id={`ko-${skill.id}`} defaultValue={skill.descriptionKo} className="w-full text-sm border rounded p-1" placeholder="Korean" />
                                                                            <input id={`en-${skill.id}`} defaultValue={skill.descriptionEn} className="w-full text-xs border rounded p-1" placeholder="English" />
                                                                        </div>
                                                                        <button
                                                                            onClick={() => {
                                                                                const code = (document.getElementById(`code-${skill.id}`) as HTMLInputElement).value;
                                                                                const ko = (document.getElementById(`ko-${skill.id}`) as HTMLInputElement).value;
                                                                                const en = (document.getElementById(`en-${skill.id}`) as HTMLInputElement).value;
                                                                                const clusterId = (document.getElementById(`cluster-${skill.id}`) as HTMLSelectElement).value;
                                                                                updateSkill(skill.id, { code, descriptionKo: ko, descriptionEn: en, clusterId: clusterId || undefined });
                                                                                setEditingId(null);
                                                                            }}
                                                                            className="text-green-600 p-1"
                                                                        ><Check className="h-4 w-4" /></button>
                                                                        <button onClick={() => setEditingId(null)} className="text-gray-400 p-1"><X className="h-4 w-4" /></button>
                                                                    </>
                                                                ) : (
                                                                    <>
                                                                        <span className="font-mono text-xs font-bold text-gray-400 bg-gray-100 px-1 rounded pt-0.5">{skill.code}</span>
                                                                        <div className="flex-1">
                                                                            <div className="text-sm text-gray-800">{skill.descriptionKo}</div>
                                                                            <div className="text-xs text-gray-500">{skill.descriptionEn}</div>
                                                                        </div>
                                                                        <div className="flex gap-1">
                                                                            <button onClick={() => setEditingId(skill.id)} className="text-gray-300 hover:text-blue-600 p-1"><Edit2 className="h-3 w-3" /></button>
                                                                            <button onClick={() => { if (confirm('Are you sure you want to delete this skill?')) deleteSkill(skill.id); }} className="text-red-300 hover:text-red-500 p-1"><Trash2 className="h-3 w-3" /></button>
                                                                        </div>
                                                                    </>
                                                                )}
                                                            </div>
                                                        ))}
                                                    </div>
                                                </div>
                                            );
                                        })()}
                                    </div>
                                )
                                }
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}
