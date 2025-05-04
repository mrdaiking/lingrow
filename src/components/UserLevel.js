'use client';

export default function UserLevel({ userLevel, translations }) {
  const { dashboard: d = {} } = translations;

  return (
    <div className="bg-gradient-to-br from-blue-50 to-indigo-50 p-5 rounded-lg border border-blue-100">
      <div className="flex justify-between items-start mb-3">
        <div>
          <h3 className="text-lg font-semibold text-blue-800">{d.yourLevel || 'Your Level'}</h3>
          <div className="text-2xl font-bold text-blue-600 mt-1">{userLevel.title}</div>
        </div>
        <div className="bg-blue-100 border border-blue-200 rounded-full h-14 w-14 flex items-center justify-center">
          <div className="text-xl font-bold text-blue-600">{userLevel.letterGrade}</div>
        </div>
      </div>
      
      <div className="mt-4">
        <div className="flex justify-between text-sm mb-1">
          <span className="font-medium text-blue-700">{d.progressToNextLevel || 'Progress to next level'}</span>
          <span className="text-blue-600 font-medium">{userLevel.progress}%</span>
        </div>
        <div className="w-full bg-blue-100 rounded-full h-2.5">
          <div className="bg-blue-600 h-2.5 rounded-full" style={{ width: `${userLevel.progress}%` }}></div>
        </div>
      </div>
      
      <div className="mt-3 text-sm text-blue-700">
        <div>{userLevel.nextMilestone - userLevel.progress} {d.practicesUntilNextLevel || 'practices until next level'}</div>
      </div>
    </div>
  );
}