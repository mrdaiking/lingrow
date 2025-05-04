'use client';

import { useState, useEffect } from 'react';
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth, isSameDay, addMonths, subMonths } from 'date-fns';

export default function MiniCalendar({ practiceDates = {}, translations }) {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [calendarDays, setCalendarDays] = useState([]);
  
  useEffect(() => {
    const monthStart = startOfMonth(currentMonth);
    const monthEnd = endOfMonth(monthStart);
    const daysInMonth = eachDayOfInterval({ start: monthStart, end: monthEnd });
    
    setCalendarDays(daysInMonth);
  }, [currentMonth]);
  
  const nextMonth = () => {
    setCurrentMonth(addMonths(currentMonth, 1));
  };
  
  const prevMonth = () => {
    setCurrentMonth(subMonths(currentMonth, 1));
  };
  
  // Split days into weeks
  const weeks = [];
  let week = [];
  
  // Add empty slots for days before the 1st of the month
  const firstDayOfMonth = calendarDays[0] || new Date();
  const dayOfWeek = firstDayOfMonth.getDay(); // 0 = Sunday, 1 = Monday, etc.
  
  for (let i = 0; i < dayOfWeek; i++) {
    week.push(null);
  }
  
  // Add days of the month
  calendarDays.forEach(day => {
    if (week.length === 7) {
      weeks.push(week);
      week = [];
    }
    week.push(day);
  });
  
  // Add empty slots for days after the last of the month
  while (week.length < 7) {
    week.push(null);
  }
  weeks.push(week);
  
  return (
    <div className="w-full">
      <div className="flex justify-between items-center mb-3">
        <button 
          onClick={prevMonth}
          className="p-1 rounded-full hover:bg-gray-100"
          aria-label="Previous month"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        <div className="text-sm font-medium text-gray-800">
          {format(currentMonth, 'MMMM yyyy')}
        </div>
        <button 
          onClick={nextMonth}
          className="p-1 rounded-full hover:bg-gray-100"
          aria-label="Next month"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>
      <div className="grid grid-cols-7 gap-1 text-xs text-center">
        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
          <div key={day} className="text-gray-500 font-medium py-1">
            {day}
          </div>
        ))}
      </div>
      <div className="grid grid-cols-7 gap-1 mt-1">
        {weeks.flatMap(week => 
          week.map((day, index) => {
            if (!day) {
              return <div key={`empty-${index}`} className="w-full aspect-square"></div>;
            }
            
            const dateKey = format(day, 'yyyy-MM-dd');
            const isPracticeDay = practiceDates[dateKey] > 0;
            const isToday = isSameDay(day, new Date());
            const isCurrentMonth = isSameMonth(day, currentMonth);
            
            return (
              <div 
                key={dateKey} 
                className={`
                  w-full aspect-square flex items-center justify-center text-xs rounded-full
                  ${!isCurrentMonth ? 'text-gray-300' : isToday ? 'border border-blue-400 font-bold' : 'text-gray-700'}
                `}
              >
                <div className={`
                  w-7 h-7 flex items-center justify-center rounded-full
                  ${isPracticeDay ? 'bg-green-500 text-white' : ''}
                `}>
                  {format(day, 'd')}
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}