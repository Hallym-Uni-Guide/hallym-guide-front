import { useEffect, useMemo, useState } from "react";
import {
  addDays,
  endOfMonth,
  endOfWeek,
  format,
  isSameMonth,
  isToday,
  isWithinInterval,
  parseISO,
  startOfMonth,
  startOfWeek,
} from "date-fns";
import "../styles/MiniCalendar.css";

const WEEKDAYS = ["일", "월", "화", "수", "목", "금", "토"];

const MiniCalendar = () => {
  const today = useMemo(() => new Date(), []);
  const [academicEvents, setAcademicEvents] = useState([]);

  useEffect(() => {
    async function loadAcademicEvents() {
      try {
        const year = today.getFullYear();
        const month = today.getMonth() + 1;
        const response = await fetch(`/api/academic-calendar?year=${year}&month=${month}`);
        const result = await response.json();

        if (response.ok && result.success) {
          setAcademicEvents(result.events);
        }
      } catch {
        setAcademicEvents([]);
      }
    }

    loadAcademicEvents();
  }, [today]);

  const weeks = useMemo(() => {
    const monthStart = startOfMonth(today);
    const monthEnd = endOfMonth(today);
    const gridStart = startOfWeek(monthStart);
    const gridEnd = endOfWeek(monthEnd);

    const days = [];
    let cursor = gridStart;
    while (cursor <= gridEnd) {
      days.push(cursor);
      cursor = addDays(cursor, 1);
    }

    const result = [];
    for (let i = 0; i < days.length; i += 7) {
      result.push(days.slice(i, i + 7));
    }
    return result;
  }, [today]);

  const hasEvent = (day) =>
    academicEvents.some((event) =>
      isWithinInterval(day, { start: parseISO(event.start), end: parseISO(event.end) })
    );

  return (
    <div className="mini_calendar">
      <div className="mini_calendar_head">
        <div className="mini_calendar_head_month">{format(today, "MM")}월</div>
        <div className="mini_calendar_head_year">{format(today, "MMMM").toUpperCase()}</div>
      </div>
      <table className="mini_calendar_table">
        <thead>
          <tr>
            {WEEKDAYS.map((day, index) => (
              <th
                key={day}
                className={index === 0 ? "mini_weekday_sun" : index === 6 ? "mini_weekday_sat" : ""}
              >
                {day}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {weeks.map((week, weekIndex) => (
            <tr key={weekIndex}>
              {week.map((day, dayIndex) => {
                const inMonth = isSameMonth(day, today);
                return (
                  <td key={dayIndex}>
                    {inMonth && (
                      <div className={`mini_day ${isToday(day) ? "mini_day_today" : ""}`}>
                        <span
                          className={
                            dayIndex === 0 ? "mini_day_sun" : dayIndex === 6 ? "mini_day_sat" : ""
                          }
                        >
                          {format(day, "d")}
                        </span>
                        {hasEvent(day) && <div className="mini_day_dot" aria-hidden="true" />}
                      </div>
                    )}
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default MiniCalendar;
