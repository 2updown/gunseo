"use client";

import { useStore } from '@/store/useStore';
import { UNITS } from '@/lib/mockData';
import { X, Trash2 } from 'lucide-react';
import { useState, useEffect } from 'react';

export function DetailPanel() {
    const {
        isPanelOpen, selectedCell, mappings,
        toggleMapping, updateMappingNote, closePanel, atlSkills
    } = useStore();

    const [note, setNote] = useState('');

    // Find current data
    const skill = selectedCell ? atlSkills.find(s => s.id === selectedCell.skillId) : null;
    const unit = selectedCell ? UNITS.find(u => u.id === selectedCell.unitId) : null;
    const mapping = selectedCell ? mappings.find(m => m.skillId === selectedCell.skillId && m.unitId === selectedCell.unitId) : null;

    useEffect(() => {
        const targetNote = mapping?.note || '';
        if (note !== targetNote) {
            setNote(targetNote);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [mapping, selectedCell?.skillId, selectedCell?.unitId]); // Reduced deps to avoid cycles

    if (!isPanelOpen || !skill || !unit) return null;

    const handleSave = () => {
        if (mapping) {
            updateMappingNote(skill.id, unit.id, note);
        } else {
            toggleMapping(skill.id, unit.id, note);
        }
        closePanel();
    };

    const handleDelete = () => {
        if (mapping) {
            toggleMapping(skill.id, unit.id); // This removes it
        }
        closePanel();
    };

    return (
        <div className="fixed right-0 top-0 bottom-0 w-96 bg-white shadow-2xl border-l border-gray-200 z-[100] flex flex-col transform transition-transform duration-300 ease-in-out">
            {/* Header */}
            <div className="h-16 flex items-center justify-between px-6 border-b border-gray-100 bg-gray-50">
                <h2 className="text-lg font-bold text-gray-800">Edit Mapping</h2>
                <button onClick={closePanel} className="p-2 text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-200">
                    <X className="h-5 w-5" />
                </button>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6">

                {/* Unit Info */}
                <div className="bg-blue-50 p-4 rounded-lg border border-blue-100">
                    <span className="text-xs font-bold text-blue-600 uppercase tracking-wider block mb-1">Target Unit</span>
                    <h3 className="font-bold text-gray-900">Grade {unit.grade} - UOI {unit.unitNo}</h3>
                    <p className="text-sm text-gray-600 mt-1">{unit.name}</p>
                </div>

                {/* Skill Info */}
                <div className="bg-gray-50 p-4 rounded-lg border border-gray-100 space-y-3">
                    <span className="text-xs font-bold text-gray-500 uppercase tracking-wider block">Target Skill</span>

                    {(() => {
                        const store = useStore.getState(); // Access current state
                        const category = store.atlCategories.find(c => c.id === skill.area);
                        const cluster = store.atlClusters.find(c => c.id === skill.clusterId);

                        return (
                            <div className="space-y-1">
                                {category && (
                                    <div className="inline-flex items-center gap-2 mb-1">
                                        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-blue-100 text-blue-700">{category.labelKo}</span>
                                        {cluster && <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-yellow-100 text-yellow-700">{cluster.labelKo}</span>}
                                    </div>
                                )}
                                <div className="flex items-center gap-2">
                                    <span className="font-mono text-xs font-bold bg-gray-200 text-gray-600 px-1 py-0.5 rounded">{skill.code}</span>
                                </div>
                                <h3 className="font-bold text-gray-900 text-sm leading-snug">{skill.descriptionKo}</h3>
                                <p className="text-xs text-gray-500">{skill.descriptionEn}</p>
                            </div>
                        );
                    })()}
                </div>
                {/* Note Input */}
                <div className="space-y-2">
                    <label className="text-xs font-bold text-gray-500 uppercase tracking-wider block">Assessment / Notes</label>
                    <textarea
                        value={note}
                        onChange={(e) => setNote(e.target.value)}
                        placeholder="Add notes about how this skill is addressed in this unit..."
                        className="w-full h-32 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none text-sm"
                    />
                </div>

                {/* Actions */}
                <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                    {mapping && (
                        <button
                            onClick={handleDelete}
                            className="flex items-center gap-2 text-red-600 hover:text-red-700 px-4 py-2 rounded-lg hover:bg-red-50 text-sm font-medium transition-colors"
                        >
                            <Trash2 className="h-4 w-4" />
                            Remove
                        </button>
                    )}
                    <div className="flex gap-3 ml-auto">
                        <button
                            onClick={closePanel}
                            className="px-4 py-2 text-gray-600 hover:text-gray-800 font-medium text-sm"
                        >
                            Cancel
                        </button>
                        <button
                            onClick={handleSave}
                            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-bold text-sm shadow-sm transition-all hover:shadow-md transform hover:-translate-y-0.5"
                        >
                            Save
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
