import React, { useState, useEffect } from 'react';
import axios from 'axios';

interface CreditDisplayProps {
  refreshTrigger?: number; // Prop to trigger a refresh
}

export const CreditDisplay: React.FC<CreditDisplayProps> = ({ refreshTrigger }) => {
  const [credits, setCredits] = useState<number | null>(null);

  const fetchCredits = () => {
    const token = localStorage.getItem('authToken');
    if (token) {
      axios.get('/api/user/credits', {
        headers: { Authorization: `Bearer ${token}` }
      })
      .then(response => setCredits(response.data.credits))
      .catch(error => console.error('Failed to fetch credits', error));
    }
  };

  useEffect(() => {
    fetchCredits();
  }, [refreshTrigger]); // Refetch when refreshTrigger changes

  if (credits === null) return null;

  return (
    <div className="text-[#dae2fd] text-sm font-medium px-4 py-2 bg-[#1b2235] rounded-lg">
      Credits: <span className="text-[#8083ff]">{credits}</span>
    </div>
  );
};
