import React from 'react';

interface CardProps {
  title: string;
  count: number | null;
}

const Card: React.FC<CardProps> = ({ title, count }) => {
  return (
    <div className="bg-[#dfdede] p-6 rounded-lg shadow-md w-full h-40 flex flex-col items-center justify-center">
      <h2 className="text-lg font-medium">{title}</h2>
      <p className="text-4xl font-bold">{count !== null ? count : 'Loading...'}</p>
    </div>
  );
};

export default Card;
