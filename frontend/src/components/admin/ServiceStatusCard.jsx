import { useState } from 'react';
import { Server, Activity, ChevronDown, ChevronUp, Layers, CheckCircle2, AlertTriangle, HelpCircle } from 'lucide-react';

const getStatusConfig = (status) => {
  switch (status) {
    case 'ONLINE':
      return {
        label: 'ONLINE',
        className: 'badge-success',
        icon: <CheckCircle2 size={13} />,
      };
    case 'DEVELOPMENT':
      return {
        label: 'DEVELOPMENT',
        className: 'badge-warning',
        icon: <AlertTriangle size={13} />,
      };
    case 'NOT CONFIGURED':
    default:
      return {
        label: 'NOT CONFIGURED',
        className: 'badge-secondary',
        icon: <HelpCircle size={13} />,
      };
  }
};

const ServiceStatusCard = ({ service }) => {
  const [showEndpoints, setShowEndpoints] = useState(false);
  const statusConfig = getStatusConfig(service.status);

  return (
    <div className="card service-status-card">
      <div className="card-body">
        {/* Top Service Identity Row */}
        <div className="service-card-top">
          <div className="service-icon-box">
            <Server size={22} />
          </div>
          <div className="service-title-info">
            <div className="service-title-row">
              <h3 className="service-name">{service.name}</h3>
              <span className={`badge ${statusConfig.className} flex-align-center gap-1`}>
                {statusConfig.icon}
                <span>{statusConfig.label}</span>
              </span>
            </div>
            <p className="service-role text-indigo">{service.role}</p>
          </div>
        </div>

        {/* Service Description */}
        <p className="service-description">{service.description}</p>

        {/* Specs Grid */}
        <div className="service-specs-grid">
          <div className="spec-item">
            <span className="spec-label">Port / Host:</span>
            <span className="spec-val">
              <code>{service.host}</code> (Port {service.port})
            </span>
          </div>
          <div className="spec-item">
            <span className="spec-label">Tech Stack:</span>
            <span className="spec-val">{service.techStack}</span>
          </div>
          <div className="spec-item">
            <span className="spec-label">Dependencies:</span>
            <span className="spec-val">{(service.dependencies || []).join(', ')}</span>
          </div>
        </div>

        {/* Endpoints Toggle Button */}
        {service.endpoints && service.endpoints.length > 0 && (
          <div className="service-endpoints-container mt-3">
            <button
              onClick={() => setShowEndpoints((prev) => !prev)}
              className="btn btn-outline btn-xs btn-block flex-align-center justify-between"
            >
              <span className="flex-align-center gap-1">
                <Layers size={13} />
                <span>REST API Endpoints ({service.endpoints.length})</span>
              </span>
              {showEndpoints ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
            </button>

            {showEndpoints && (
              <div className="endpoints-dropdown-list mt-2">
                {service.endpoints.map((ep, idx) => (
                  <div key={idx} className="endpoint-item-row">
                    <span className={`method-tag method-${ep.method.toLowerCase()}`}>
                      {ep.method}
                    </span>
                    <code className="endpoint-path">{ep.path}</code>
                    <span className="endpoint-desc text-muted">{ep.desc}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Footer Note */}
        <div className="service-card-footer mt-3 pt-2 border-top">
          <span className="service-note-text flex-align-center gap-1 text-muted text-xs">
            <Activity size={12} className="text-indigo" />
            <span>{service.statusNote}</span>
          </span>
        </div>
      </div>
    </div>
  );
};

export default ServiceStatusCard;
