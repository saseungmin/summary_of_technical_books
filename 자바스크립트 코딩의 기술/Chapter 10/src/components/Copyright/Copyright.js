import React from 'react';
import './Copyright.css';

function Copyright() {
  const year = new Date().getFullYear();

  return (
    <div className="copyright">
      Copyright {year}
    </div>
  );
}

export default Copyright;