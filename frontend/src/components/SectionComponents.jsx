import React from 'react';
import { useState } from 'react';
// TODO delete this file 


export const BusinessSection = () => (
<section className="bg-white p-6 shadow-md h-screen">
    <h1 className="text-2xl font-bold mb-4">Business Overview</h1>
    <p>Detailed business insights and analytics.</p>
    {/* Add more business-related content */}
  </section>
);



export const LogsSection = () => (
    <section className="bg-white p-6 shadow-md h-screen">
    <h1 className="text-2xl font-bold mb-4">Help & Support</h1>
    <p>Find answers to frequently asked questions.</p>
    {/* Add help resources */}
  </section>
);

export const DefaultSection = () => (
  <section className="bg-white p-6 shadow-md h-screen">
    <h1 className="text-2xl font-bold mb-4">Welcome to SalesSphere</h1>
    <p>Select a section from the sidebar to get started.</p>
  </section>
);