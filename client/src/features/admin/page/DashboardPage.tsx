
import React from 'react';
import Sidebar from '../components/Sidebar';
import Header from '../components/Header';
import StatCardsGrid from '../components/StatCardsGrid';

const DashboardPage: React.FC = () => {
  return (
    <div className="flex min-h-screen bg-gray-50">
     
      <Sidebar />

     
      <div className="ml-56 flex-1 p-6">
       
        <Header />

        
        <StatCardsGrid />
      </div>
    </div>
  );
};

export default DashboardPage;