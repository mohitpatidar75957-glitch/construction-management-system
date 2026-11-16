import React from 'react';
import Navbar from '../Navbar';

export default function Header({ onRefresh }) {
  return <Navbar onRefresh={onRefresh} />;
}

