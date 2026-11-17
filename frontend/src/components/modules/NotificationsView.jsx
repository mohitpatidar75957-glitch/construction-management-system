import React, { useState, useEffect } from 'react';
import { 
  Bell, 
  Send, 
  CheckCircle2, 
  AlertTriangle, 
  Clock, 
  MessageSquare, 
  Mail, 
  Smartphone, 
  ShieldCheck,
  IndianRupee,
  Layers,
  Building2,
  PackageX,
  Search,
  Filter,
  Check,
  Trash2,
  Plus,
  ArrowRight,
  TrendingUp,
  X
} from 'lucide-react';
import { api, DEFAULT_NOTIFICATIONS, DEFAULT_PROJECTS } from '../../api/client';

export default function NotificationsView() {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('ALL'); // 'ALL', 'PAYMENT', 'PROJECT_UPDATE', 'MATERIAL_SHORTAGE'
  const [searchQuery, setSearchQuery] = useState('');
  const [toastMsg, setToastMsg] = useState('');
  const [showDispatchModal, setShowDispatchModal] = useState(false);

  // New Notification Dispatch Form
  const [dispatchForm, setDispatchForm] = useState({
    category: 'PAYMENT',
    title: '',
    message: '',
    site: 'Skyline Commercial Hub (Project A)',
    amount: '',
    current_stock: '',
    min_threshold: '',
    progress: '',
    channel: 'WHATSAPP & SMS',
    recipient: 'Er. Mohit Patidar (Director)'
  });

  const showToast = (msg) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(''), 4500);
  };

  const loadNotifications = async () => {
    setLoading(true);
    try {
      const data = await api.getNotifications();
      setNotifications(Array.isArray(data) && data.length > 0 ? data : DEFAULT_NOTIFICATIONS);
    } catch (err) {
      console.error('Error loading notifications:', err);
      setNotifications(DEFAULT_NOTIFICATIONS);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadNotifications();
  }, []);

  const handleMarkAsRead = async (id) => {
    await api.markNotificationRead(id);
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
    showToast('Notification marked as read.');
  };

  const handleMarkAllRead = async () => {
    await api.markAllNotificationsRead();
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
    showToast('All notifications marked as read.');
  };

  const handleDelete = async (id) => {
    await api.deleteNotification(id);
    setNotifications(prev => prev.filter(n => n.id !== id));
    showToast('Notification removed from log.');
  };

  const handleDispatchSubmit = async (e) => {
    e.preventDefault();
    if (!dispatchForm.title || !dispatchForm.message) {
      alert('Please enter a title and message for the alert.');
      return;
    }

    let severity = 'INFO';
    if (dispatchForm.category === 'MATERIAL_SHORTAGE') severity = 'DANGER';
    if (dispatchForm.category === 'PAYMENT') severity = 'SUCCESS';
    if (dispatchForm.category === 'PROJECT_UPDATE') severity = 'INFO';

    const newAlert = {
      ...dispatchForm,
      severity
    };

    await api.createNotification(newAlert);
    await loadNotifications();
    setShowDispatchModal(false);
    showToast(`Instant alert transmitted via ${dispatchForm.channel}!`);

    // Reset Form
    setDispatchForm({
      category: 'PAYMENT',
      title: '',
      message: '',
      site: 'Skyline Commercial Hub (Project A)',
      amount: '',
      current_stock: '',
      min_threshold: '',
      progress: '',
      channel: 'WHATSAPP & SMS',
      recipient: 'Er. Mohit Patidar (Director)'
    });
  };

  // Quick Dispatch Helpers for standard events
  const triggerQuickShortageAlert = async () => {
    const alertData = {
      category: 'MATERIAL_SHORTAGE',
      type: 'STOCK_CRITICAL',
      severity: 'DANGER',
      title: 'URGENT: UltraTech 53G Cement Re-order Needed',
      message: 'Stock at Skyline Hub dropped below 300 Bags threshold (Current: 180 Bags). Pouring for 6th floor columns scheduled tomorrow at risk.',
      site: 'Skyline Commercial Hub (Project A)',
      current_stock: '180 Bags',
      min_threshold: '300 Bags',
      channel: 'WHATSAPP & APP PUSH',
      recipient: 'Er. Ankit Sharma & UltraTech Depot'
    };
    await api.createNotification(alertData);
    await loadNotifications();
    showToast('🚨 Cement shortage alert broadcasted to site incharge & supplier!');
  };

  const triggerQuickPaymentAlert = async () => {
    const alertData = {
      category: 'PAYMENT',
      type: 'PAYMENT_RECEIVED',
      severity: 'SUCCESS',
      title: 'Customer Payment Confirmed: ₹25,00,000 Received',
      message: 'Skyline Infra Corp credited ₹25 Lakhs via RTGS UTR #HDFC098218 towards 8th Floor Milestone RA Bill #05.',
      site: 'Skyline Commercial Hub (Project A)',
      amount: '₹25,00,000',
      channel: 'SMS & WHATSAPP',
      recipient: 'Accounts & Er. Mohit Patidar'
    };
    await api.createNotification(alertData);
    await loadNotifications();
    showToast('💰 Payment receipt alert recorded and sent via WhatsApp!');
  };

  const triggerQuickProjectAlert = async () => {
    const alertData = {
      category: 'PROJECT_UPDATE',
      type: 'MILESTONE_PROGRESS',
      severity: 'INFO',
      title: 'Project Milestone Achieved: Superstructure 70%',
      message: 'Grand Horizon Enclave completed external brick masonry on south elevation. Daily labor turnout recorded at 48 workers.',
      site: 'Grand Horizon Enclave (Project B)',
      progress: '70%',
      channel: 'SYSTEM & EMAIL',
      recipient: 'Client & Executive Management'
    };
    await api.createNotification(alertData);
    await loadNotifications();
    showToast('🏗️ Milestone update notification dispatched!');
  };

  // Filtered Notifications
  const filteredNotifications = notifications.filter(n => {
    if (activeTab !== 'ALL' && n.category !== activeTab) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchTitle = (n.title || '').toLowerCase().includes(q);
      const matchMsg = (n.message || '').toLowerCase().includes(q);
      const matchSite = (n.site || '').toLowerCase().includes(q);
      const matchRecipient = (n.recipient || '').toLowerCase().includes(q);
      if (!matchTitle && !matchMsg && !matchSite && !matchRecipient) return false;
    }
    return true;
  });

  // Calculate stats
  const unreadCount = notifications.filter(n => !n.read).length;
  const paymentCount = notifications.filter(n => n.category === 'PAYMENT').length;
  const projectCount = notifications.filter(n => n.category === 'PROJECT_UPDATE').length;
  const shortageCount = notifications.filter(n => n.category === 'MATERIAL_SHORTAGE').length;

  return (
    <div className="module-view-container animate-fade-in" style={{ width: '100%' }}>
      {/* Toast Notification */}
      {toastMsg && (
        <div style={{
          position: 'fixed',
          top: '24px',
          right: '24px',
          zIndex: 9999,
          background: 'linear-gradient(135deg, #0F172A, #1E293B)',
          color: '#FFFFFF',
          padding: '14px 22px',
          borderRadius: '16px',
          border: '1.5px solid rgba(255, 255, 255, 0.4)',
          boxShadow: '0 20px 40px rgba(0, 0, 0, 0.35)',
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
          fontSize: '13px',
          fontWeight: 600
        }}>
          <CheckCircle2 size={18} color="#10B981" />
          <span>{toastMsg}</span>
        </div>
      )}

      {/* Header Row */}
      <div className="module-header-row">
        <div>
          <h2 className="module-title">Automated Notifications <span className="amp">&</span> Alerts Engine</h2>
          <p className="module-subtitle">
            Real-time automated broadcasts for customer payments, project milestone progress <span className="amp">&</span> inventory material shortages
          </p>
        </div>
        <div style={{ display: 'flex', gap: '10px', alignItems: 'center', flexWrap: 'wrap' }}>
          {unreadCount > 0 && (
            <button 
              type="button" 
              onClick={handleMarkAllRead}
              className="glass-pill"
              style={{ 
                padding: '8px 16px', 
                fontSize: '12px', 
                fontWeight: 700, 
                color: '#2563EB', 
                cursor: 'pointer',
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '6px'
              }}
            >
              <Check size={15} style={{ flexShrink: 0 }} />
              <span style={{ lineHeight: 1 }}>Mark All Read ({unreadCount})</span>
            </button>
          )}

          <button className="btn-dubai-gold" onClick={() => setShowDispatchModal(true)}>
            <Plus size={16} />
            <span>Dispatch Broadcast Alert</span>
          </button>
        </div>
      </div>

      {/* KPI Cards: The 3 Core Pillars (Payments, Project Updates, Material Shortages) */}
      <div className="financial-kpi-grid">
        {/* Pillar 1: Payment Notifications */}
        <div 
          onClick={() => setActiveTab(activeTab === 'PAYMENT' ? 'ALL' : 'PAYMENT')}
          className="dubai-card fin-stat-card"
          style={{ cursor: 'pointer', border: activeTab === 'PAYMENT' ? '2px solid #10B981' : undefined }}
        >
          <div className="fin-card-top">
            <span className="fin-label">Payment Alerts</span>
            <span className="fin-icon-pill icon-green"><IndianRupee size={18} /></span>
          </div>
          <div className="fin-val text-green">{paymentCount} Payout & RA Bills</div>
          <div className="fin-sub">Inward customer deposits & supplier advice</div>
        </div>

        {/* Pillar 2: Project Updates */}
        <div 
          onClick={() => setActiveTab(activeTab === 'PROJECT_UPDATE' ? 'ALL' : 'PROJECT_UPDATE')}
          className="dubai-card fin-stat-card"
          style={{ cursor: 'pointer', border: activeTab === 'PROJECT_UPDATE' ? '2px solid #2563EB' : undefined }}
        >
          <div className="fin-card-top">
            <span className="fin-label">Project Updates</span>
            <span className="fin-icon-pill icon-cyan"><TrendingUp size={18} /></span>
          </div>
          <div className="fin-val text-cyan">{projectCount} Milestone Logs</div>
          <div className="fin-sub">DPR verification & site completion telemetry</div>
        </div>

        {/* Pillar 3: Material Shortages */}
        <div 
          onClick={() => setActiveTab(activeTab === 'MATERIAL_SHORTAGE' ? 'ALL' : 'MATERIAL_SHORTAGE')}
          className="dubai-card fin-stat-card"
          style={{ cursor: 'pointer', border: activeTab === 'MATERIAL_SHORTAGE' ? '2px solid #EF4444' : undefined }}
        >
          <div className="fin-card-top">
            <span className="fin-label">Material Shortages</span>
            <span className="fin-icon-pill icon-red"><PackageX size={18} /></span>
          </div>
          <div className="fin-val text-rose">{shortageCount} Critical Shortages</div>
          <div className="fin-sub">Below min re-order stock threshold</div>
        </div>

        {/* Gateway Health */}
        <div className="dubai-card fin-stat-card">
          <div className="fin-card-top">
            <span className="fin-label">Multi-Channel Gateway</span>
            <span className="fin-icon-pill icon-gold"><MessageSquare size={18} /></span>
          </div>
          <div className="fin-val">WhatsApp & SMS Live</div>
          <div className="fin-sub">Meta Cloud API & Telecom DLT Verified</div>
        </div>
      </div>

      {/* Quick Action Simulation Buttons */}
      <div style={{
        background: 'rgba(255, 255, 255, 0.7)',
        padding: '14px 20px',
        borderRadius: '16px',
        border: '1px solid rgba(255, 255, 255, 0.9)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '12px'
      }}>
        <div style={{ fontSize: '12.5px', fontWeight: 800, color: '#0F172A', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Bell size={16} color="#2563EB" />
          <span>Broadcast Testing: Trigger Immediate Event Alerts:</span>
        </div>
        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
          <button
            type="button"
            onClick={triggerQuickPaymentAlert}
            style={{
              padding: '6px 14px',
              borderRadius: '9999px',
              border: '1px solid rgba(16, 185, 129, 0.35)',
              background: '#ECFDF5',
              color: '#065F46',
              fontSize: '11.5px',
              fontWeight: 800,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px'
            }}
          >
            <IndianRupee size={12} />
            <span>+ Simulate Payment Received</span>
          </button>

          <button
            type="button"
            onClick={triggerQuickProjectAlert}
            style={{
              padding: '6px 14px',
              borderRadius: '9999px',
              border: '1px solid rgba(37, 99, 235, 0.35)',
              background: '#EFF6FF',
              color: '#1D4ED8',
              fontSize: '11.5px',
              fontWeight: 800,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px'
            }}
          >
            <Building2 size={12} />
            <span>+ Simulate Project Update</span>
          </button>

          <button
            type="button"
            onClick={triggerQuickShortageAlert}
            style={{
              padding: '6px 14px',
              borderRadius: '9999px',
              border: '1px solid rgba(239, 68, 68, 0.35)',
              background: '#FEF2F2',
              color: '#991B1B',
              fontSize: '11.5px',
              fontWeight: 800,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px'
            }}
          >
            <PackageX size={12} />
            <span>+ Trigger Material Shortage</span>
          </button>
        </div>
      </div>

      {/* Filter Tabs & Search Bar */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: '14px',
        flexWrap: 'wrap'
      }}>
        {/* Category Pills */}
        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', alignItems: 'center' }}>
          <button
            onClick={() => setActiveTab('ALL')}
            style={{
              padding: '8px 16px',
              borderRadius: '9999px',
              border: activeTab === 'ALL' ? '1.5px solid #2563EB' : '1px solid rgba(255, 255, 255, 0.7)',
              background: activeTab === 'ALL' ? '#0F172A' : 'rgba(255, 255, 255, 0.65)',
              color: activeTab === 'ALL' ? '#FFFFFF' : '#334155',
              fontSize: '12px',
              fontWeight: 700,
              cursor: 'pointer',
              boxShadow: activeTab === 'ALL' ? '0 4px 12px rgba(15, 23, 42, 0.15)' : 'none'
            }}
          >
            All Alerts ({notifications.length})
          </button>

          <button
            onClick={() => setActiveTab('PAYMENT')}
            style={{
              padding: '8px 16px',
              borderRadius: '9999px',
              border: activeTab === 'PAYMENT' ? '1.5px solid #10B981' : '1px solid rgba(255, 255, 255, 0.7)',
              background: activeTab === 'PAYMENT' ? '#065F46' : 'rgba(255, 255, 255, 0.65)',
              color: activeTab === 'PAYMENT' ? '#FFFFFF' : '#065F46',
              fontSize: '12px',
              fontWeight: 700,
              cursor: 'pointer',
              boxShadow: activeTab === 'PAYMENT' ? '0 4px 12px rgba(6, 95, 70, 0.2)' : 'none',
              display: 'flex',
              alignItems: 'center',
              gap: '6px'
            }}
          >
            <span>💰 Payment Alerts</span>
            <span style={{ background: 'rgba(255,255,255,0.25)', padding: '1px 6px', borderRadius: '9999px', fontSize: '10px' }}>
              {paymentCount}
            </span>
          </button>

          <button
            onClick={() => setActiveTab('PROJECT_UPDATE')}
            style={{
              padding: '8px 16px',
              borderRadius: '9999px',
              border: activeTab === 'PROJECT_UPDATE' ? '1.5px solid #2563EB' : '1px solid rgba(255, 255, 255, 0.7)',
              background: activeTab === 'PROJECT_UPDATE' ? '#1E40AF' : 'rgba(255, 255, 255, 0.65)',
              color: activeTab === 'PROJECT_UPDATE' ? '#FFFFFF' : '#1E40AF',
              fontSize: '12px',
              fontWeight: 700,
              cursor: 'pointer',
              boxShadow: activeTab === 'PROJECT_UPDATE' ? '0 4px 12px rgba(30, 64, 175, 0.2)' : 'none',
              display: 'flex',
              alignItems: 'center',
              gap: '6px'
            }}
          >
            <span>🏗️ Project Updates</span>
            <span style={{ background: 'rgba(255,255,255,0.25)', padding: '1px 6px', borderRadius: '9999px', fontSize: '10px' }}>
              {projectCount}
            </span>
          </button>

          <button
            onClick={() => setActiveTab('MATERIAL_SHORTAGE')}
            style={{
              padding: '8px 16px',
              borderRadius: '9999px',
              border: activeTab === 'MATERIAL_SHORTAGE' ? '1.5px solid #EF4444' : '1px solid rgba(239, 68, 68, 0.3)',
              background: activeTab === 'MATERIAL_SHORTAGE' ? '#991B1B' : '#FEF2F2',
              color: activeTab === 'MATERIAL_SHORTAGE' ? '#FFFFFF' : '#991B1B',
              fontSize: '12px',
              fontWeight: 700,
              cursor: 'pointer',
              boxShadow: activeTab === 'MATERIAL_SHORTAGE' ? '0 4px 12px rgba(153, 27, 27, 0.2)' : 'none',
              display: 'flex',
              alignItems: 'center',
              gap: '6px'
            }}
          >
            <span>🚨 Material Shortages</span>
            <span style={{ background: 'rgba(255,255,255,0.25)', padding: '1px 6px', borderRadius: '9999px', fontSize: '10px' }}>
              {shortageCount}
            </span>
          </button>
        </div>

        {/* Search Bar */}
        <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
          <Search size={14} style={{ position: 'absolute', left: '12px', color: '#64748B' }} />
          <input
            type="text"
            placeholder="Search payments, updates, materials..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{
              padding: '8px 14px 8px 34px',
              borderRadius: '12px',
              border: '1px solid rgba(203, 213, 225, 0.8)',
              background: 'rgba(255, 255, 255, 0.85)',
              fontSize: '12px',
              color: '#0F172A',
              outline: 'none',
              width: '260px'
            }}
          />
        </div>
      </div>

      {/* Main Notifications Feed */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
        {filteredNotifications.length === 0 ? (
          <div className="dubai-card" style={{ padding: '40px', textAlign: 'center', color: '#64748B' }}>
            <Bell size={36} color="#94A3B8" style={{ margin: '0 auto 10px auto' }} />
            <div style={{ fontSize: '14px', fontWeight: 700 }}>No notifications found matching this category</div>
            <div style={{ fontSize: '12px', marginTop: '4px' }}>All construction sites and inventory levels are within normal limits.</div>
          </div>
        ) : (
          filteredNotifications.map(item => {
            const isPayment = item.category === 'PAYMENT';
            const isShortage = item.category === 'MATERIAL_SHORTAGE';
            const isProject = item.category === 'PROJECT_UPDATE';

            return (
              <div
                key={item.id}
                className="dubai-card animate-fade-in"
                style={{
                  padding: '18px 22px',
                  borderRadius: '18px',
                  background: item.read ? 'rgba(255, 255, 255, 0.72)' : 'rgba(255, 255, 255, 0.95)',
                  borderLeft: isShortage 
                    ? '4px solid #EF4444' 
                    : isPayment 
                      ? '4px solid #10B981' 
                      : '4px solid #2563EB',
                  boxShadow: item.read 
                    ? '0 6px 18px rgba(10, 25, 70, 0.04)' 
                    : '0 10px 28px rgba(10, 25, 70, 0.08)',
                  display: 'flex',
                  alignItems: 'flex-start',
                  justifyContent: 'space-between',
                  gap: '16px',
                  transition: 'all 0.15s ease'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '16px', flex: 1 }}>
                  {/* Category Leading Icon */}
                  <div style={{
                    width: '44px',
                    height: '44px',
                    borderRadius: '12px',
                    background: isShortage 
                      ? '#FEE2E2' 
                      : isPayment 
                        ? '#DCFCE7' 
                        : '#DBEAFE',
                    color: isShortage 
                      ? '#DC2626' 
                      : isPayment 
                        ? '#16A34A' 
                        : '#2563EB',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0,
                    boxShadow: '0 4px 10px rgba(0, 0, 0, 0.05)'
                  }}>
                    {isShortage && <PackageX size={22} />}
                    {isPayment && <IndianRupee size={22} />}
                    {isProject && <TrendingUp size={22} />}
                  </div>

                  {/* Body Content */}
                  <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
                      <span className={`status-tag ${
                        isShortage ? 'tag-red' : isPayment ? 'tag-green' : 'tag-cyan'
                      }`}>
                        {isShortage ? 'MATERIAL SHORTAGE' : isPayment ? 'PAYMENT ALERT' : 'PROJECT MILESTONE'}
                      </span>
                      
                      <span style={{ fontSize: '11px', color: '#64748B', fontWeight: 600 }}>
                        {item.site}
                      </span>

                      <span style={{ fontSize: '11px', color: '#94A3B8' }}>•</span>

                      <span style={{ fontSize: '11px', color: '#94A3B8', display: 'flex', alignItems: 'center', gap: '4px' }}>
                        <Clock size={12} /> {item.time}
                      </span>
                    </div>

                    <h3 style={{ fontSize: '14.5px', fontWeight: 800, color: '#0F172A', margin: '6px 0 4px 0' }}>
                      {item.title}
                    </h3>

                    <p style={{ fontSize: '13px', color: '#334155', margin: 0, lineHeight: 1.5 }}>
                      {item.message}
                    </p>

                    {/* Metadata Pill Highlights */}
                    <div style={{ display: 'flex', gap: '10px', marginTop: '10px', flexWrap: 'wrap', alignItems: 'center' }}>
                      {item.amount && (
                        <span style={{
                          padding: '3px 10px',
                          borderRadius: '8px',
                          background: '#ECFDF5',
                          color: '#065F46',
                          fontSize: '11.5px',
                          fontWeight: 800,
                          border: '1px solid #A7F3D0'
                        }}>
                          Amount: {item.amount}
                        </span>
                      )}

                      {item.current_stock && (
                        <span style={{
                          padding: '3px 10px',
                          borderRadius: '8px',
                          background: '#FEF2F2',
                          color: '#991B1B',
                          fontSize: '11.5px',
                          fontWeight: 800,
                          border: '1px solid #FECACA'
                        }}>
                          Current Stock: {item.current_stock} (Min: {item.min_threshold})
                        </span>
                      )}

                      {item.progress && (
                        <span style={{
                          padding: '3px 10px',
                          borderRadius: '8px',
                          background: '#EFF6FF',
                          color: '#1E40AF',
                          fontSize: '11.5px',
                          fontWeight: 800,
                          border: '1px solid #BFDBFE'
                        }}>
                          Progress: {item.progress}
                        </span>
                      )}

                      <span style={{ fontSize: '11px', color: '#64748B', display: 'flex', alignItems: 'center', gap: '4px' }}>
                        <MessageSquare size={12} color="#2563EB" />
                        <span>Channel: <b>{item.channel}</b></span>
                      </span>

                      <span style={{ fontSize: '11px', color: '#64748B' }}>
                        Recipient: <b>{item.recipient}</b>
                      </span>
                    </div>
                  </div>
                </div>

                {/* Right Action Buttons */}
                <div style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
                  {!item.read && (
                    <button
                      type="button"
                      onClick={() => handleMarkAsRead(item.id)}
                      title="Mark as Read"
                      style={{
                        padding: '6px 10px',
                        borderRadius: '8px',
                        border: '1px solid rgba(16, 185, 129, 0.3)',
                        background: '#ECFDF5',
                        color: '#059669',
                        fontSize: '11px',
                        fontWeight: 700,
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '4px'
                      }}
                    >
                      <Check size={12} />
                      <span>Read</span>
                    </button>
                  )}

                  <button
                    type="button"
                    onClick={() => handleDelete(item.id)}
                    title="Dismiss Notification"
                    style={{
                      padding: '6px 8px',
                      borderRadius: '8px',
                      border: '1px solid rgba(203, 213, 225, 0.8)',
                      background: '#FFFFFF',
                      color: '#64748B',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center'
                    }}
                  >
                    <Trash2 size={12} />
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* ========================================================
          DISPATCH BROADCAST NOTIFICATION MODAL
      ======================================================== */}
      {showDispatchModal && (
        <div className="modal-backdrop">
          <div className="dubai-modal-box large-modal" style={{ maxWidth: '640px' }}>
            <div className="modal-header">
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <div style={{ width: '40px', height: '40px', borderRadius: '12px', background: '#2563EB', color: '#FFFFFF', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Send size={20} />
                </div>
                <div>
                  <h3 style={{ margin: 0, fontSize: '18px', fontWeight: 800 }}>Dispatch Automated Broadcast Alert</h3>
                  <div style={{ fontSize: '12px', color: '#64748B' }}>Transmit live updates via WhatsApp, SMS and In-App Push</div>
                </div>
              </div>
              <button className="modal-close-btn" onClick={() => setShowDispatchModal(false)}>
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleDispatchSubmit} className="modal-form">
              <div className="form-group-row">
                <div className="form-group">
                  <label>Notification Category *</label>
                  <select
                    value={dispatchForm.category}
                    onChange={(e) => setDispatchForm({ ...dispatchForm, category: e.target.value })}
                  >
                    <option value="PAYMENT">💰 Payment Alert (RA Bill / Payout / Deposit)</option>
                    <option value="PROJECT_UPDATE">🏗️ Project Update (Milestone / DPR / Schedule)</option>
                    <option value="MATERIAL_SHORTAGE">🚨 Material Shortage (Low Inventory Warning)</option>
                  </select>
                </div>

                <div className="form-group">
                  <label>Construction Site *</label>
                  <select
                    value={dispatchForm.site}
                    onChange={(e) => setDispatchForm({ ...dispatchForm, site: e.target.value })}
                  >
                    <option value="Skyline Commercial Hub (Project A)">Skyline Commercial Hub (Project A)</option>
                    <option value="Grand Horizon Enclave (Project B)">Grand Horizon Enclave (Project B)</option>
                    <option value="Mahakal Metro Package (Project C)">Mahakal Metro Package (Project C)</option>
                    <option value="Chamunda Industrial Park (Project D)">Chamunda Industrial Park (Project D)</option>
                  </select>
                </div>
              </div>

              <div className="form-group">
                <label>Alert Subject / Headline *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. UltraTech Cement Re-order Needed Immediately"
                  value={dispatchForm.title}
                  onChange={(e) => setDispatchForm({ ...dispatchForm, title: e.target.value })}
                />
              </div>

              <div className="form-group">
                <label>Detailed Message *</label>
                <textarea
                  rows="3"
                  required
                  placeholder="e.g. Stock at Skyline Hub dropped below 300 Bags threshold (Current: 180 Bags). Re-order approved."
                  value={dispatchForm.message}
                  onChange={(e) => setDispatchForm({ ...dispatchForm, message: e.target.value })}
                ></textarea>
              </div>

              {/* Dynamic Context Fields depending on Category */}
              {dispatchForm.category === 'PAYMENT' && (
                <div className="form-group">
                  <label>Payment Amount (₹)</label>
                  <input
                    type="text"
                    placeholder="e.g. ₹25,00,000"
                    value={dispatchForm.amount}
                    onChange={(e) => setDispatchForm({ ...dispatchForm, amount: e.target.value })}
                  />
                </div>
              )}

              {dispatchForm.category === 'MATERIAL_SHORTAGE' && (
                <div className="form-group-row">
                  <div className="form-group">
                    <label>Current Stock</label>
                    <input
                      type="text"
                      placeholder="e.g. 180 Bags"
                      value={dispatchForm.current_stock}
                      onChange={(e) => setDispatchForm({ ...dispatchForm, current_stock: e.target.value })}
                    />
                  </div>
                  <div className="form-group">
                    <label>Minimum Threshold</label>
                    <input
                      type="text"
                      placeholder="e.g. 400 Bags"
                      value={dispatchForm.min_threshold}
                      onChange={(e) => setDispatchForm({ ...dispatchForm, min_threshold: e.target.value })}
                    />
                  </div>
                </div>
              )}

              {dispatchForm.category === 'PROJECT_UPDATE' && (
                <div className="form-group">
                  <label>Completion / Milestone Progress (%)</label>
                  <input
                    type="text"
                    placeholder="e.g. 85%"
                    value={dispatchForm.progress}
                    onChange={(e) => setDispatchForm({ ...dispatchForm, progress: e.target.value })}
                  />
                </div>
              )}

              <div className="form-group-row">
                <div className="form-group">
                  <label>Broadcast Channels</label>
                  <select
                    value={dispatchForm.channel}
                    onChange={(e) => setDispatchForm({ ...dispatchForm, channel: e.target.value })}
                  >
                    <option value="WHATSAPP & SMS">WhatsApp & SMS Direct Dispatch</option>
                    <option value="WHATSAPP ONLY">WhatsApp Cloud API Only</option>
                    <option value="SMS ONLY">SMS Gateway Only (DLT Route)</option>
                    <option value="SYSTEM & EMAIL">In-App Push & Email Digest</option>
                  </select>
                </div>

                <div className="form-group">
                  <label>Target Recipient</label>
                  <input
                    type="text"
                    placeholder="e.g. Er. Mohit Patidar & Site Engineers"
                    value={dispatchForm.recipient}
                    onChange={(e) => setDispatchForm({ ...dispatchForm, recipient: e.target.value })}
                  />
                </div>
              </div>

              <div className="modal-actions-bar">
                <button type="button" className="btn-glass-outline" onClick={() => setShowDispatchModal(false)}>
                  Cancel
                </button>
                <button type="submit" className="btn-dubai-gold">
                  <Send size={15} />
                  <span>Transmit Live Broadcast</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
