import React from 'react';
import { MapPin, ArrowRight } from 'lucide-react';

export default function ProjectCard({ project, onClick }) {
  const progress = Number(project.progress_percent || 0);
  const isDelayed = project.status === 'ON_HOLD' || progress < 40;
  const isAlmostComplete = progress >= 90;
  const statusBadge = isAlmostComplete ? 'Almost Complete' : isDelayed ? 'Delayed' : 'On Track';
  const badgeClass = isAlmostComplete ? 'tag-purple' : isDelayed ? 'tag-rose' : 'tag-green';

  return (
    <div className="project-overview-card" onClick={onClick}>
      <div className="proj-card-header">
        <span className="proj-code-pill">{project.project_code || 'SITE'}</span>
        <span className={`status-tag ${badgeClass}`}>
          <span className="status-dot"></span>
          {statusBadge}
        </span>
      </div>

      <div>
        <h4 className="proj-card-title">{project.project_name}</h4>
        <div className="proj-location-row">
          <MapPin size={13} />
          <span>{project.site_location}</span>
        </div>
      </div>

      <div className="proj-progress-section">
        <div className="progress-label-row">
          <span>Completion</span>
          <span className="progress-percent-bold">{progress}%</span>
        </div>
        <div className="dubai-progress-track">
          <div 
            className={`dubai-progress-bar ${isDelayed ? 'bar-rose' : 'bar-gold'}`} 
            style={{ width: `${progress}%` }}
          ></div>
        </div>
      </div>

      <div className="proj-finance-summary">
        <div className="fin-col">
          <span className="fin-mini-label">Budget</span>
          <span className="fin-mini-val">₹{(Number(project.budget) / 10000000).toFixed(1)} Cr</span>
        </div>
        <div className="fin-col" style={{ textAlign: 'right' }}>
          <span className="fin-mini-label">Spent</span>
          <span className="fin-mini-val">₹{(Number(project.spent) / 10000000).toFixed(1)} Cr</span>
        </div>
      </div>

      <div className="proj-card-footer">
        <div className="view-details-action">
          <span>Site Intel Drawer</span>
          <ArrowRight size={14} />
        </div>
      </div>
    </div>
  );
}

