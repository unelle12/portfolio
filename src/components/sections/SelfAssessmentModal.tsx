import { useState } from 'react';
import { SectionModal } from '../ui/SectionModal';
import { useContent } from '../../context/ContentContext';

export function SelfAssessmentModal({ isOpen, onClose }) {
  const { content, updateSection } = useContent();
  const [data, setData] = useState(() => JSON.parse(JSON.stringify(content.selfAssessment)));
  const [selectedIdx, setSelectedIdx] = useState(0);

  const outcome = data.outcomes[selectedIdx];

  const handleOutcomeChange = (field, value) => {
    setData((prev) => {
      const outcomes = [...prev.outcomes];
      outcomes[selectedIdx] = { ...outcomes[selectedIdx], [field]: value };
      return { ...prev, outcomes };
    });
  };

  const handleIndicatorChange = (indIdx, field, value) => {
    setData((prev) => {
      const outcomes = [...prev.outcomes];
      const indicators = [...outcomes[selectedIdx].indicators];
      indicators[indIdx] = { ...indicators[indIdx], [field]: value };
      outcomes[selectedIdx] = { ...outcomes[selectedIdx], indicators };
      return { ...prev, outcomes };
    });
  };

  const handleSave = () => {
    updateSection('selfAssessment', data);
    onClose();
  };

  return (
    <SectionModal isOpen={isOpen} onClose={onClose} title="Edit Self-Assessment" onSave={handleSave}>
      <div className="modal-field">
        <label>Select Outcome</label>
        <select
          className="input"
          value={selectedIdx}
          onChange={(e) => setSelectedIdx(Number(e.target.value))}
        >
          {data.outcomes.map((o, i) => (
            <option key={o.id} value={i}>{o.shortTitle}</option>
          ))}
        </select>
      </div>

      {outcome && (
        <>
          <div className="modal-row">
            <div className="modal-field">
              <label>Full Title</label>
              <input
                className="input"
                value={outcome.title}
                onChange={(e) => handleOutcomeChange('title', e.target.value)}
              />
            </div>
            <div className="modal-field">
              <label>Short Title</label>
              <input
                className="input"
                value={outcome.shortTitle}
                onChange={(e) => handleOutcomeChange('shortTitle', e.target.value)}
              />
            </div>
          </div>

          <div className="modal-row">
            <div className="modal-field">
              <label>Score (0-5)</label>
              <input
                className="input"
                type="number"
                min="0"
                max="5"
                step="0.1"
                value={outcome.score}
                onChange={(e) => handleOutcomeChange('score', parseFloat(e.target.value) || 0)}
              />
            </div>
            <div className="modal-field">
              <label>Max Score</label>
              <input
                className="input"
                type="number"
                min="1"
                max="10"
                value={outcome.maxScore}
                onChange={(e) => handleOutcomeChange('maxScore', parseInt(e.target.value) || 5)}
              />
            </div>
          </div>

          <div className="modal-field">
            <label>Interpretation</label>
            <textarea
              className="input textarea"
              rows={3}
              value={outcome.interpretation}
              onChange={(e) => handleOutcomeChange('interpretation', e.target.value)}
            />
          </div>

          <p className="modal-section-label">Indicators</p>

          {outcome.indicators.map((ind, i) => (
            <div key={ind.id} className="modal-row">
              <div className="modal-field">
                <label>Indicator {i + 1}</label>
                <input
                  className="input"
                  value={ind.text}
                  onChange={(e) => handleIndicatorChange(i, 'text', e.target.value)}
                />
              </div>
              <div className="modal-field">
                <label>Rating (1-5)</label>
                <input
                  className="input"
                  type="number"
                  min="1"
                  max="5"
                  step="1"
                  value={ind.rating}
                  onChange={(e) => handleIndicatorChange(i, 'rating', parseInt(e.target.value) || 1)}
                />
              </div>
            </div>
          ))}
        </>
      )}
    </SectionModal>
  );
}
