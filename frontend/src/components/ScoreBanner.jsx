import React from 'react';
import robotCow from '../assets/robot-cow.png';
import spilledMilk from '../assets/logo.png'; // Using logo as the spilled milk icon

const ScoreBanner = ({ llmScore, userScore, reviewCount }) => {
  // Helper to determine color based on score (0-10 scale for LLM, 0-5 for User)
  const getScoreColor = (score, max) => {
    const percentage = score / max;
    if (percentage >= 0.7) return 'text-green-600';
    if (percentage >= 0.4) return 'text-yellow-600';
    return 'text-red-600';
  };

  const formatScore = (score) => {
    return score !== undefined && score !== null ? Number(score).toFixed(1) : '-';
  };

  return (
    <div className="bg-white shadow rounded-lg p-4 mb-6 flex flex-col sm:flex-row items-center justify-around gap-4">
      {/* LLM Score */}
      <div className="flex flex-col items-center">
        <div className="flex items-center space-x-2">
          <img src={robotCow} alt="Robot Cow" className="w-12 h-12 object-contain" />
          <div className="flex flex-col">
            <span className="text-xs text-gray-500 uppercase font-bold tracking-wide">AI Score</span>
            <span className={`text-3xl font-bold ${getScoreColor(llmScore, 10)}`}>
              {formatScore(llmScore)}<span className="text-sm text-gray-400">/10</span>
            </span>
          </div>
        </div>
      </div>

      {/* Divider (Hidden on mobile) */}
      <div className="hidden sm:block w-px h-12 bg-gray-200"></div>

      {/* User Score */}
      <div className="flex flex-col items-center">
        <div className="flex items-center space-x-2">
          <img src={spilledMilk} alt="Spilled Milk" className="w-12 h-12 object-contain" />
          <div className="flex flex-col">
            <span className="text-xs text-gray-500 uppercase font-bold tracking-wide">User Score</span>
            <span className={`text-3xl font-bold ${getScoreColor(userScore, 5)}`}>
              {formatScore(userScore)}<span className="text-sm text-gray-400">/5</span>
            </span>
            <span className="text-xs text-gray-400">({reviewCount} reviews)</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ScoreBanner;
