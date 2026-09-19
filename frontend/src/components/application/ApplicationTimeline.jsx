import { CheckCircle2, Clock, Award, CheckCheck, XCircle, CircleDot, Calendar } from 'lucide-react';

const STAGES = [
  {
    key: 'APPLIED',
    label: 'Application Submitted',
    defaultDesc: 'Application received and logged into TalentPulse portal.',
    icon: CheckCircle2,
  },
  {
    key: 'UNDER_REVIEW',
    label: 'Under Review',
    defaultDesc: 'Hiring team is evaluating candidate qualifications and technical background.',
    icon: Clock,
  },
  {
    key: 'SHORTLISTED',
    label: 'Shortlisted',
    defaultDesc: 'Candidate shortlisted for interview screening and technical evaluation.',
    icon: Award,
  },
  {
    key: 'DECISION',
    label: 'Final Decision',
    defaultDesc: 'Hiring decision and outcome notification.',
    icon: CheckCheck,
  },
];

const getStatusRank = (status) => {
  const norm = (status || 'APPLIED').toUpperCase().replace(/\s+/g, '_');
  switch (norm) {
    case 'APPLIED':
      return 1;
    case 'UNDER_REVIEW':
      return 2;
    case 'SHORTLISTED':
      return 3;
    case 'SELECTED':
    case 'ACCEPTED':
    case 'REJECTED':
      return 4;
    default:
      return 1;
  }
};

const ApplicationTimeline = ({ status, appliedDate, lastUpdated, customTimeline = [] }) => {
  const normalizedStatus = (status || 'APPLIED').toUpperCase().replace(/\s+/g, '_');
  const currentRank = getStatusRank(normalizedStatus);
  const isRejected = normalizedStatus === 'REJECTED';
  const isSelected = normalizedStatus === 'SELECTED' || normalizedStatus === 'ACCEPTED';

  // Build timeline steps mapping actual recorded events
  const steps = STAGES.map((stage, idx) => {
    const stepRank = idx + 1;
    const isCompleted = stepRank < currentRank || (stepRank === 4 && (isSelected || isRejected));
    const isCurrent = stepRank === currentRank && !isCompleted;

    let title = stage.label;
    let desc = stage.defaultDesc;
    let date = null;
    let Icon = stage.icon;

    if (stage.key === 'APPLIED') {
      date = appliedDate;
    }

    if (stage.key === 'DECISION') {
      if (isSelected) {
        title = 'Selected & Offer Extended';
        desc = 'Candidate has been selected for the role and offer extended.';
        Icon = CheckCheck;
        date = lastUpdated || appliedDate;
      } else if (isRejected) {
        title = 'Application Not Selected';
        desc = 'Thank you for your interest. The requisition has proceeded with other candidates.';
        Icon = XCircle;
        date = lastUpdated || appliedDate;
      } else {
        title = 'Final Decision';
        desc = 'Pending review and interview evaluations.';
      }
    }

    // Match with custom recorded timeline event if present
    if (customTimeline && customTimeline.length > 0) {
      const match = customTimeline.find((evt) => {
        const evtNorm = (evt.status || '').toUpperCase().replace(/\s+/g, '_');
        return evtNorm === stage.key || (stage.key === 'DECISION' && (evtNorm === 'SELECTED' || evtNorm === 'REJECTED'));
      });
      if (match) {
        if (match.title) title = match.title;
        if (match.description) desc = match.description;
        if (match.date) date = match.date;
      }
    }

    if (isCurrent && !date) {
      date = lastUpdated || appliedDate;
    }

    let statusType = 'pending';
    if (isCompleted || (stepRank === currentRank && (isSelected || isRejected))) {
      statusType = isRejected && stage.key === 'DECISION' ? 'rejected' : 'completed';
    } else if (isCurrent) {
      statusType = 'current';
    }

    return {
      key: stage.key,
      title,
      desc,
      date,
      Icon,
      statusType,
      stepNumber: idx + 1,
    };
  });

  return (
    <div className="application-timeline-container">
      <div className="timeline-track">
        {steps.map((step, idx) => {
          const StepIcon = step.Icon;
          return (
            <div
              key={step.key}
              className={`timeline-step-item timeline-step-${step.statusType}`}
            >
              <div className="timeline-connector-container">
                <div className={`timeline-icon-bubble bubble-${step.statusType}`}>
                  {step.statusType === 'current' ? (
                    <CircleDot size={18} className="pulse-icon" />
                  ) : (
                    <StepIcon size={18} />
                  )}
                </div>
                {idx < steps.length - 1 && (
                  <div
                    className={`timeline-line ${
                      step.statusType === 'completed' ? 'line-completed' : 'line-pending'
                    }`}
                  />
                )}
              </div>

              <div className="timeline-content-card">
                <div className="timeline-step-header">
                  <h4 className="timeline-step-title">{step.title}</h4>
                  {step.date && (
                    <span className="timeline-step-date">
                      <Calendar size={12} style={{ marginRight: 4 }} />
                      {step.date}
                    </span>
                  )}
                </div>
                <p className="timeline-step-desc">{step.desc}</p>
                {step.statusType === 'current' && (
                  <span className="timeline-status-pill in-progress">Current Stage</span>
                )}
                {step.statusType === 'completed' && (
                  <span className="timeline-status-pill completed">Completed</span>
                )}
                {step.statusType === 'rejected' && (
                  <span className="timeline-status-pill rejected">Closed</span>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ApplicationTimeline;
