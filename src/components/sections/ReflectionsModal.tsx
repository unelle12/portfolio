import { useState } from 'react';
import { SectionModal } from '../ui/SectionModal';
import { useContent } from '../../context/ContentContext';
import { api } from '~/trpc/react';

interface ReflectionsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

type FlatEvidence = {
  id: number;
  title: string;
  type: string;
  fileType: string;
  description: string;
  thumbnail: string;
  fileUrl: string;
  filePath: string | null;
  highlightedSection: string;
  memoNote: string;
  date: string;
  subfolderId: number | null;
  createdAt: string;
  updatedAt: string;
};

type FlatSubfolder = {
  evidence: FlatEvidence[];
  children: FlatSubfolder[];
};

function flattenEvidence(subfolders: FlatSubfolder[]): FlatEvidence[] {
  return subfolders.flatMap((sf) => [...sf.evidence, ...flattenEvidence(sf.children)]);
}

export function ReflectionsModal({ isOpen, onClose }: ReflectionsModalProps) {
  const { content, updateReflection } = useContent();
  const reflections = (content.reflections as Array<{ evidenceId: string; paragraphs: string[] }>) ?? [];
  const { data: terms = [] } = api.evidence.getAll.useQuery();

  const evidenceItems: FlatEvidence[] = terms.flatMap((term) =>
    flattenEvidence(term.subfolders as FlatSubfolder[])
  );

  const [selectedIdx, setSelectedIdx] = useState(0);
  const currentReflection = reflections[selectedIdx];

  const [paragraphs, setParagraphs] = useState<string[]>(
    currentReflection?.paragraphs ?? []
  );

  const handleSelectChange = (idx: number) => {
    setSelectedIdx(idx);
    setParagraphs([...(reflections[idx]?.paragraphs ?? [])]);
  };

  const handleParagraphChange = (index: number, value: string) => {
    setParagraphs((prev) => {
      const next = [...prev];
      next[index] = value;
      return next;
    });
  };

  const handleSave = () => {
    if (currentReflection) {
      updateReflection(currentReflection.evidenceId, paragraphs);
    }
    onClose();
  };

  if (!currentReflection) return null;

  const evidence = evidenceItems.find(
    (ev) => ev.id.toString() === currentReflection.evidenceId.replace('ev-', '')
  );

  return (
    <SectionModal isOpen={isOpen} onClose={onClose} title="Edit Reflections" onSave={handleSave}>
      <div className="modal-field">
        <label>Select Reflection</label>
        <select
          className="input"
          value={selectedIdx}
          onChange={(e) => handleSelectChange(Number(e.target.value))}
        >
          {reflections.map((r, i) => {
            const ev = evidenceItems.find(
              (e) => e.id.toString() === r.evidenceId.replace('ev-', '')
            );
            return (
              <option key={r.evidenceId} value={i}>
                {ev?.title || r.evidenceId}
              </option>
            );
          })}
        </select>
      </div>

      {paragraphs.map((paragraph, i) => (
        <div key={i} className="modal-field">
          <label>Paragraph {i + 1}</label>
          <textarea
            className="input textarea"
            rows={5}
            value={paragraph}
            onChange={(e) => handleParagraphChange(i, e.target.value)}
          />
        </div>
      ))}
    </SectionModal>
  );
}
