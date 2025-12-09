import { useState } from 'react';
import { X, Plus, Trash2, RefreshCw } from 'lucide-react';
import type { SubjectConfig } from '@/hooks/useSchedule';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  subjects: SubjectConfig;
  onUpdateSubjects: (subjects: SubjectConfig) => void;
  onResetSchedule: () => void;
}

export const SettingsModal = ({
  isOpen,
  onClose,
  subjects,
  onUpdateSubjects,
  onResetSchedule,
}: SettingsModalProps) => {
  const [localSubjects, setLocalSubjects] = useState<SubjectConfig>(subjects);
  const [newSubject, setNewSubject] = useState('');
  const [newCount, setNewCount] = useState(3);

  if (!isOpen) return null;

  const handleAddSubject = () => {
    if (!newSubject.trim() || localSubjects[newSubject]) return;
    setLocalSubjects({ ...localSubjects, [newSubject.trim()]: newCount });
    setNewSubject('');
    setNewCount(3);
  };

  const handleRemoveSubject = (subject: string) => {
    const updated = { ...localSubjects };
    delete updated[subject];
    setLocalSubjects(updated);
  };

  const handleUpdateCount = (subject: string, count: number) => {
    if (count < 1) return;
    setLocalSubjects({ ...localSubjects, [subject]: count });
  };

  const handleSave = () => {
    onUpdateSubjects(localSubjects);
    onClose();
  };

  const handleRegenerate = () => {
    onUpdateSubjects(localSubjects);
    onResetSchedule();
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[90] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-background/80 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative w-full max-w-lg glass-card p-6 animate-slide-up">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-medium text-foreground">Subject Settings</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-white/10 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Subject List */}
        <div className="space-y-3 max-h-64 overflow-y-auto custom-scrollbar mb-6">
          {Object.entries(localSubjects).map(([subject, count]) => (
            <div
              key={subject}
              className="flex items-center gap-3 p-3 bg-white/5 rounded-xl border border-white/10"
            >
              <span className="flex-1 text-sm text-foreground">{subject}</span>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleUpdateCount(subject, count - 1)}
                  className="w-7 h-7 flex items-center justify-center bg-white/5 hover:bg-white/10 rounded-lg text-sm transition-colors"
                >
                  -
                </button>
                <span className="w-8 text-center text-sm font-mono">{count}</span>
                <button
                  onClick={() => handleUpdateCount(subject, count + 1)}
                  className="w-7 h-7 flex items-center justify-center bg-white/5 hover:bg-white/10 rounded-lg text-sm transition-colors"
                >
                  +
                </button>
              </div>
              <button
                onClick={() => handleRemoveSubject(subject)}
                className="p-2 hover:bg-destructive/20 hover:text-destructive rounded-lg transition-all"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>

        {/* Add New Subject */}
        <div className="flex items-center gap-2 mb-6">
          <input
            value={newSubject}
            onChange={(e) => setNewSubject(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleAddSubject()}
            placeholder="New subject..."
            className="flex-1 glass-input text-sm"
          />
          <input
            type="number"
            value={newCount}
            onChange={(e) => setNewCount(parseInt(e.target.value) || 1)}
            min={1}
            className="w-16 glass-input text-sm text-center"
          />
          <button
            onClick={handleAddSubject}
            className="p-3 bg-primary/20 hover:bg-primary/30 text-primary rounded-xl transition-colors"
          >
            <Plus className="w-4 h-4" />
          </button>
        </div>

        {/* Actions */}
        <div className="flex gap-3">
          <button
            onClick={handleRegenerate}
            className="flex-1 btn-aurora-outline flex items-center justify-center gap-2"
          >
            <RefreshCw className="w-4 h-4" />
            Regenerate Schedule
          </button>
          <button onClick={handleSave} className="flex-1 btn-aurora">
            Save Settings
          </button>
        </div>
      </div>
    </div>
  );
};
