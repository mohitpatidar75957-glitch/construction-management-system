import React, { useState } from 'react';
import { 
  Bell, 
  Send, 
  CheckCircle2, 
  AlertTriangle, 
  Clock, 
  MessageSquare, 
  Mail, 
  Smartphone,
  ShieldCheck
} from 'lucide-react';

export default function NotificationsView() {
  const [alerts, setAlerts] = useState([
    { id: 1, channel: 'WHATSAPP', recipient: '+91 98260 11223 (UltraTech)', title: 'Urgent Material Re-order Triggered', message: 'PO-2026-081 approved. 1,200 bags PPC required at Skyline Hub by 15 Nov.', time: '10 Mins ago', status: 'DELIVERED' },
    { id: 2, channel: 'SMS', recipient: '+91 94250 88991 (Tata Steel)', title: 'Payment Advice Notification', message: 'NEFT UTR #HDFC009182 disbursed ₹14,75,000 against RA bill #04.', time: '2 Hours ago', status: 'DELIVERED' },
    { id: 3, channel: 'WHATSAPP', recipient: '+91 98001 23456 (Buyer Anand Mehta)', title: 'Milestone Demand Letter Generated', message: 'Dear Mr. Mehta, Tower A 5th Floor slab is casted. Installment of ₹40L due in 25 days.', time: 'Yesterday', status: 'DELIVERED' },
    { id: 4, channel: 'EMAIL', recipient: 'owner@sitepilot.in (Mohit Patidar)', title: 'Low Stock Alert Warning', message: 'Sariya 12mm inventory below 5 Tons threshold at Palm Residency.', time: '11 Nov, 2026', status: 'SENT' },
  ]);

  const [testSent, setTestSent] = useState(false);

  const handleSendTest = () => {
    setTestSent(true);
    setTimeout(() => {
      setAlerts([
        { id: alerts.length + 1, channel: 'WHATSAPP', recipient: '+91 99999 88888 (Owner)', title: 'Test System Health Ping', message: 'SitePilot automated alert engine active. WhatsApp gateway connected.', time: 'Just now', status: 'DELIVERED' },
        ...alerts
      ]);
      setTestSent(false);
    }, 1000);
  };

  return (
    <div className="module-view-container">
      <div className="module-header-row">
        <div>
          <h2 className="module-title">Automated Notifications <span className="amp">&</span> Communication Gateway</h2>
          <p className="module-subtitle">WhatsApp business alerts, SMS dispatch notifications, payment demand alerts <span className="amp">&</span> low-stock pings</p>
        </div>
        <button className="btn-dubai-gold" onClick={handleSendTest}>
          <Send size={15} />
          <span>{testSent ? 'Transmitting...' : 'Send Test WhatsApp Alert'}</span>
        </button>
      </div>

      <div className="financial-kpi-grid">
        <div className="dubai-card fin-stat-card">
          <div className="fin-card-top"><span className="fin-label">WhatsApp Gateway</span><span className="fin-icon-pill icon-green"><MessageSquare size={18} /></span></div>
          <div className="fin-val text-green">Online & Active</div>
          <div className="fin-sub">Meta Cloud API Business connected</div>
        </div>
        <div className="dubai-card fin-stat-card">
          <div className="fin-card-top"><span className="fin-label">Dispatched Alerts Today</span><span className="fin-icon-pill icon-gold"><Bell size={18} /></span></div>
          <div className="fin-val">28 Notifications</div>
          <div className="fin-sub">Attendance, PO dispatch & demand pings</div>
        </div>
        <div className="dubai-card fin-stat-card">
          <div className="fin-card-top"><span className="fin-label">SMS Delivery Rate</span><span className="fin-icon-pill icon-cyan"><Smartphone size={18} /></span></div>
          <div className="fin-val text-cyan">99.2%</div>
          <div className="fin-sub">Telecom DLT approved construction route</div>
        </div>
        <div className="dubai-card fin-stat-card">
          <div className="fin-card-top"><span className="fin-label">Email Transmissions</span><span className="fin-icon-pill icon-amber"><Mail size={18} /></span></div>
          <div className="fin-val text-amber">Active</div>
          <div className="fin-sub">Automated daily executive summary reports</div>
        </div>
      </div>

      <div className="dubai-card clear-table-card">
        <div className="table-header-bar">
          <div className="table-title-group">
            <Bell size={18} className="gold-text" />
            <h3>Notification Audit Trail <span className="amp">&</span> Dispatch Logs</h3>
          </div>
        </div>

        <div className="dubai-table-wrap">
          <table className="dubai-table">
            <thead>
              <tr>
                <th>Channel</th>
                <th>Recipient Contact</th>
                <th>Alert Subject</th>
                <th>Message Snippet</th>
                <th>Time Sent</th>
                <th>Delivery Status</th>
              </tr>
            </thead>
            <tbody>
              {alerts.map(a => (
                <tr key={a.id}>
                  <td>
                    <span className={`status-tag ${a.channel === 'WHATSAPP' ? 'tag-green' : a.channel === 'SMS' ? 'tag-cyan' : 'tag-purple'}`}>
                      {a.channel}
                    </span>
                  </td>
                  <td><b>{a.recipient}</b></td>
                  <td><div style={{ color: '#0F172A', fontWeight: 700 }}>{a.title}</div></td>
                  <td style={{ color: '#64748B', fontSize: '12px', maxWidth: '320px' }}>{a.message}</td>
                  <td><span style={{ fontSize: '11.5px', color: '#94A3B8' }}>{a.time}</span></td>
                  <td>
                    <span className="status-tag tag-green">
                      <span className="status-dot"></span>
                      {a.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

