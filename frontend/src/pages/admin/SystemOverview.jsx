import { useState, useEffect } from 'react';
import adminService from '../../services/adminService';
import ServiceStatusCard from '../../components/admin/ServiceStatusCard';
import {
  Server,
  Layers,
  ArrowRight,
  Cpu,
  Info,
} from 'lucide-react';

const SystemOverview = () => {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    adminService
      .getSystemOverview()
      .then((data) => {
        if (isMounted) setServices(data || []);
      })
      .catch((err) => {
        console.error('Failed to load system topology:', err);
      })
      .finally(() => {
        if (isMounted) setLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <div className="admin-system-page">
      {/* Page Header */}
      <div className="page-header">
        <div>
          <h1>System & Microservice Overview</h1>
          <p className="page-subtitle">
            Technical architecture status, Eureka service discovery registry, and API Gateway route topology.
          </p>
        </div>
      </div>

      {/* Architectural Notice Callout */}
      <div className="system-architecture-banner mb-4">
        <div className="flex-align-center gap-3">
          <div className="sab-icon-box">
            <Cpu size={26} />
          </div>
          <div className="sab-text">
            <h3>Enterprise Microservice Mesh Architecture</h3>
            <p>
              TalentPulse is structured across independent, distributed Spring Boot microservices discovered dynamically via Netflix Eureka and routed through Spring Cloud API Gateway.
            </p>
          </div>
        </div>
      </div>

      {/* Microservices Topology Grid */}
      <div className="section-card mb-4">
        <div className="section-card-header flex-align-center justify-between">
          <div className="flex-align-center gap-2">
            <Server size={18} className="text-indigo" />
            <h2>Registered Microservices ({services.length})</h2>
          </div>
          <span className="badge badge-info">Phase 2 Architecture</span>
        </div>

        {loading ? (
          <div className="text-center p-5">
            <div className="spinner mx-auto mb-3" />
            <p className="text-muted">Loading microservice mesh specifications...</p>
          </div>
        ) : (
          <div className="microservices-cards-grid">
            {services.map((svc) => (
              <ServiceStatusCard key={svc.id} service={svc} />
            ))}
          </div>
        )}
      </div>

      {/* High-Level Architecture Topology Flow */}
      <div className="section-card">
        <div className="section-card-header flex-align-center gap-2">
          <Layers size={18} className="text-indigo" />
          <h2>High-Level Platform Routing Architecture</h2>
        </div>

        <div className="architecture-flow-diagram">
          <div className="arch-node client-node">
            <span className="arch-node-tag">Client Layer</span>
            <strong>React + Vite SPA</strong>
            <span className="text-xs text-muted">Browser Portal (Port 5174)</span>
          </div>

          <div className="arch-flow-arrow">
            <ArrowRight size={20} className="text-indigo" />
            <span className="text-xs text-muted">REST API / JWT</span>
          </div>

          <div className="arch-node gateway-node">
            <span className="arch-node-tag">Gateway Layer</span>
            <strong>Spring Cloud Gateway</strong>
            <span className="text-xs text-muted">Central Port 8080</span>
          </div>

          <div className="arch-flow-arrow">
            <ArrowRight size={20} className="text-indigo" />
            <span className="text-xs text-muted">Eureka Route</span>
          </div>

          <div className="arch-node services-cluster-node">
            <span className="arch-node-tag">Microservice Layer</span>
            <strong>Auth (8081) • Profile (8082) • Job (8083) • App (8084)</strong>
            <span className="text-xs text-muted">Discovered via Eureka Registry (8761)</span>
          </div>

          <div className="arch-flow-arrow">
            <ArrowRight size={20} className="text-indigo" />
            <span className="text-xs text-muted">JPA / Hibernate</span>
          </div>

          <div className="arch-node db-node">
            <span className="arch-node-tag">Persistence Layer</span>
            <strong>MySQL Databases</strong>
            <span className="text-xs text-muted">talentpulse_auth, talentpulse_jobs</span>
          </div>
        </div>

        <div className="arch-note-box mt-3 flex-align-center gap-2 text-xs text-muted">
          <Info size={14} className="text-indigo" />
          <span>
            Note: In M3 Phase 2 (Frontend Foundation), service statuses reflect configured architecture topology. Real-time Actuator health metrics will connect in Phase 3.
          </span>
        </div>
      </div>
    </div>
  );
};

export default SystemOverview;
