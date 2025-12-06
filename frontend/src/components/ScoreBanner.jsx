import React from 'react';
import robotCow from '../assets/robot-cow.png';
import spilledMilk from '../assets/logo.png'; // Using logo as the spilled milk icon

const ScoreBanner = ({ llmScore, userScore, reviewCount }) => {
  // Helper to determine color based on score (0-10 scale for LLM, 0-5 for User)
  const getScoreColor = (score, max) => {
    if (score === null || score === undefined) return 'text-indigo-600';
    const percentage = score / max;
    if (percentage >= 0.7) return 'text-green-600';
    if (percentage >= 0.4) return 'text-yellow-600';
    return 'text-red-600';
  };

  const formatScore = (score) => {
    return score !== undefined && score !== null ? Number(score).toFixed(1) : '-';
  };

  console.log("ScoreBanner rendering", { llmScore, userScore, reviewCount });
  return (
    <div className="flex items-center gap-4">
      {/* LLM Score */}
      <div className="flex items-center gap-3">
        <img src={robotCow} alt="Robot Cow" className="w-12 h-12 object-contain" />
        <div className="flex flex-col items-start">
          <span className={`text-3xl font-black ${getScoreColor(llmScore, 10)}`}>
            {llmScore !== null && llmScore !== undefined ? `${Math.round(llmScore * 10)}%` : '--'}
          </span>
          <span className="text-xs font-bold text-gray-500 uppercase tracking-wide">Dairy-Free</span>
        </div>
      </div>

      {/* User Score */}
      <div className="flex items-center gap-3">
        <img src={spilledMilk} alt="Spilled Milk" className="w-20 h-20 object-contain" />
        <div className="flex flex-col items-start">
          <span className={`text-3xl font-black ${getScoreColor(userScore, 5)}`}>
            {userScore !== null && userScore !== undefined ? `${Math.round((userScore / 5) * 100)}%` : '--'}
          </span>
          <span className="text-xs font-bold text-gray-500 uppercase tracking-wide">User Score</span>
          <span className="text-[10px] text-indigo-600 font-medium hover:underline cursor-pointer">
            {reviewCount} Reviews
          </span>
        </div>
      </div>
    </div>
  );
};

export default ScoreBanner;
