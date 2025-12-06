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
    <div className="bg-gray-100 py-6 mb-6 flex items-center justify-center gap-12 sm:gap-24">
      {/* LLM Score */}
      <div className="flex items-center gap-4">
        <img src={robotCow} alt="Robot Cow" className="w-16 h-16 object-contain" />
        <div className="flex flex-col">
          <span className={`text-4xl font-black ${getScoreColor(llmScore, 10)}`}>
            {llmScore ? `${Math.round(llmScore * 10)}%` : '--'}
          </span>
          <span className="text-sm font-bold text-gray-900 uppercase tracking-tight">Dairy-Free Score</span>
        </div>
      </div>

      {/* User Score */}
      <div className="flex items-center gap-4">
        <img src={spilledMilk} alt="Spilled Milk" className="w-16 h-16 object-contain" />
        <div className="flex flex-col">
          <span className={`text-4xl font-black ${getScoreColor(userScore, 5)}`}>
            {userScore ? `${Math.round((userScore / 5) * 100)}%` : '--'}
          </span>
          <span className="text-sm font-bold text-gray-900 uppercase tracking-tight">User Score</span>
          <span className="text-xs text-blue-600 font-medium hover:underline cursor-pointer">
            {reviewCount} Reviews
          </span>
        </div>
      </div>
    </div>
  );
};

export default ScoreBanner;
