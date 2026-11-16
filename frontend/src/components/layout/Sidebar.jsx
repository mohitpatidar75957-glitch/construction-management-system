import React from 'react';
import BaseSidebar from '../Sidebar';

export default function Sidebar({ activeTab, setActiveTab }) {
  return <BaseSidebar activeTab={activeTab} setActiveTab={setActiveTab} />;
}

