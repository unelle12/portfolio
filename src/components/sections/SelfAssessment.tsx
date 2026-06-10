import { useState } from 'react';
import { Container, Heading, Text, Badge, Card } from '../ui';
import { RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, ResponsiveContainer, Tooltip } from 'recharts';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { useContent } from '../../context/ContentContext';
import { EditButton } from '../common/EditButton';
import { SelfAssessmentModal } from './SelfAssessmentModal';

const COLORS = {
  stroke: '#F4AE52',
  fill: '#F4AE5233',
  grid: '#4F252E22',
  text: '#4F252E',
};

function RatingBar({ rating, maxRating = 5 }) {
  return (
    <div className="rating-bar">
      {Array.from({ length: maxRating }, (_, i) => (
        <div
          key={i}
          className={`rating-dot ${i < rating ? 'filled' : ''}`}
        />
      ))}
      <span className="rating-value">{rating}/{maxRating}</span>
    </div>
  );
}

function OutcomeCard({ outcome }) {
  const [expanded, setExpanded] = useState(false);

  return (
    <Card padding="md" className="outcome-card">
      <button
        className="outcome-header"
        onClick={() => setExpanded(!expanded)}
        aria-expanded={expanded}
      >
        <div className="outcome-header-content">
          <div className="outcome-score-badge">
            <span className="outcome-score">{outcome.score}</span>
            <span className="outcome-max">/{outcome.maxScore}</span>
          </div>
          <div className="outcome-title-group">
            <Heading as="h4" variant="h5">{outcome.title}</Heading>
            <Text size="sm" muted>{outcome.interpretation}</Text>
          </div>
        </div>
        {expanded ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
      </button>

      {expanded && (
        <div className="outcome-indicators">
          {outcome.indicators.map((indicator) => (
            <div key={indicator.id} className="indicator-row">
              <Text size="sm" className="indicator-text">{indicator.text}</Text>
              <RatingBar rating={indicator.rating} />
            </div>
          ))}
        </div>
      )}
    </Card>
  );
}

export function SelfAssessment() {
  const { content, isEditMode } = useContent();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const selfAssessment = content.selfAssessment as { outcomes: Array<{
    id: string;
    shortTitle: string;
    title: string;
    score: number;
    maxScore: number;
    interpretation: string;
    indicators: Array<{ id: string; text: string; rating: number }>;
  }> } | null;

  const outcomes = selfAssessment?.outcomes ?? [];

  const radarData = outcomes.map((o) => ({
    subject: o.shortTitle,
    score: o.score,
    fullMark: o.maxScore,
  }));

  return (
    <section id="assessment" className="section" style={{ background: 'var(--section-odd-bg)', position: 'relative' }}>
      {isEditMode && <EditButton onClick={() => setIsModalOpen(true)} label="Edit Self-Assessment" />}

      <Container>
        <div className="section-header center">
          <Badge variant="accent" className="section-badge">PNU Outcomes</Badge>
          <Heading as="h2" variant="h2" center className="section-title">
            Self-Assessment Results
          </Heading>
          <Text size="lg" muted className="section-description" style={{ marginInline: 'auto' }}>
            My self-assessment across Philippine Normal University's five institutional outcomes.
          </Text>
        </div>

        <div className="assessment-layout">
          <div className="assessment-chart-wrapper">
            <Card padding="lg" className="assessment-chart-card">
              <ResponsiveContainer width="100%" height={350}>
                <RadarChart data={radarData} cx="50%" cy="50%" outerRadius="75%">
                  <PolarGrid stroke={COLORS.grid} />
                  <PolarAngleAxis
                    dataKey="subject"
                    tick={{ fill: 'var(--color-text-primary)', fontSize: 13, fontFamily: 'var(--font-heading)' }}
                  />
                  <PolarRadiusAxis
                    angle={90}
                    domain={[0, 5]}
                    tick={{ fill: 'var(--color-text-muted)', fontSize: 11 }}
                  />
                  <Radar
                    name="Score"
                    dataKey="score"
                    stroke={COLORS.stroke}
                    fill={COLORS.fill}
                    strokeWidth={2}
                  />
                  <Tooltip
                    contentStyle={{
                      background: 'var(--color-card-bg)',
                      border: '1px solid var(--color-border)',
                      borderRadius: 'var(--radius-md)',
                      fontFamily: 'var(--font-sans)',
                    }}
                  />
                </RadarChart>
              </ResponsiveContainer>
            </Card>
          </div>

          <div className="assessment-outcomes">
            {outcomes.map((outcome) => (
              <OutcomeCard key={outcome.id} outcome={outcome} />
            ))}
          </div>
        </div>
      </Container>

      <SelfAssessmentModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />

      <style>{`
        .assessment-layout {
          display: grid;
          grid-template-columns: 1fr;
          gap: var(--space-8);
        }
        @media (min-width: 1024px) {
          .assessment-layout {
            grid-template-columns: 1fr 1fr;
          }
        }
        .assessment-chart-card {
          position: sticky;
          top: 100px;
        }
        .assessment-outcomes {
          display: flex;
          flex-direction: column;
          gap: var(--space-4);
        }
        .outcome-card {
          cursor: default;
        }
        .outcome-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          width: 100%;
          text-align: left;
          gap: var(--space-3);
          color: var(--color-text-primary);
        }
        .outcome-header-content {
          display: flex;
          align-items: center;
          gap: var(--space-4);
          flex: 1;
        }
        .outcome-score-badge {
          display: flex;
          align-items: baseline;
          background: var(--assessment-score-bg);
          padding: var(--space-2) var(--space-3);
          border-radius: var(--radius-lg);
          flex-shrink: 0;
        }
        .outcome-score {
          font-family: var(--font-heading);
          font-size: var(--text-xl);
          font-weight: var(--weight-bold);
          color: var(--color-accent);
        }
        .outcome-max {
          font-size: var(--text-sm);
          color: var(--color-text-muted);
        }
        .outcome-title-group {
          flex: 1;
          min-width: 0;
        }
        .outcome-title-group h4 {
          margin-bottom: var(--space-1);
        }
        .outcome-indicators {
          margin-top: var(--space-4);
          padding-top: var(--space-4);
          border-top: 1px solid var(--color-border);
          display: flex;
          flex-direction: column;
          gap: var(--space-3);
        }
        .indicator-row {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: var(--space-4);
        }
        .indicator-text {
          flex: 1;
        }
        .rating-bar {
          display: flex;
          align-items: center;
          gap: var(--space-1);
          flex-shrink: 0;
        }
        .rating-dot {
          width: 10px;
          height: 10px;
          border-radius: var(--radius-full);
          background: var(--assessment-bar-bg);
          transition: background var(--duration-fast) var(--ease-in-out);
        }
        .rating-dot.filled {
          background: var(--color-accent);
        }
        .rating-value {
          font-size: var(--text-xs);
          color: var(--color-text-muted);
          margin-left: var(--space-2);
          min-width: 30px;
        }
      `}</style>
    </section>
  );
}
