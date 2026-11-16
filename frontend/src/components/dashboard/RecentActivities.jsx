import React from 'react';

export default function RecentActivities({ activities = [] }) {
  return (
    <div className="activity-timeline-list">
      {activities.map((act) => {
        const tagClass = 
          act.type === 'success' ? 'activity-tag-green' :
          act.type === 'update' ? 'activity-tag-blue' : 'activity-tag-purple';

        return (
          <div key={act.id} className="activity-row">
            <div className="activity-dot-col">
              <span className="activity-dot"></span>
            </div>
            <div className="activity-details-col">
              <span className="activity-time">{act.time}</span>
              <span className="activity-title">{act.title}</span>
            </div>
            <div className="activity-tag-col">
              <span className={`activity-tag ${tagClass}`}>{act.tag}</span>
            </div>
          </div>
        );
      })}
    </div>
  );
}

