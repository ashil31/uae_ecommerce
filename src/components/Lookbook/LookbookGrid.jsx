import React from 'react';
import LookbookCard from './LookbookCard';

const LookbookGrid = ({ lookbooks, onOpen }) => (
  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
    {lookbooks.map(lb => (
      <LookbookCard key={lb._id} lookbook={lb} onOpen={onOpen} />
    ))}
  </div>
);

export default LookbookGrid;
