import { useMemo, useState } from "react";
import {
  addDays,
  endOfMonth,
  endOfWeek,
  format,
  isSameDay,
  isSameMonth,
  isToday,
  isWithinInterval,
  parseISO,
  startOfMonth,
  startOfWeek,
} from "date-fns";
import Header from "../components/Header";
import Footer from "../components/Footer";
import AiChat from "../components/AiChat";
import "../styles/AcademicCalendarPage.css";

const WEEKDAYS = ["일", "월", "화", "수", "목", "금", "토"];
const MONTHS = Array.from({ length: 12 }, (_, i) => i + 1);

const EVENTS = [
  { start: "2026-06-30", end: "2026-07-01", label: "성적이의 신청" },
  { start: "2026-06-23", end: "2026-07-13", label: "하계 계절수업" },
  { start: "2026-07-17", end: "2026-07-17", label: "제헌절", isHoliday: true },
  { start: "2026-07-21", end: "2026-07-23", label: "2학기 수강신청 사전수요조사" },
];

const formatRangeLabel = (dateStr) => {
  const date = parseISO(dateStr);
  return `${format(date, "yyyy.MM.dd")}(${WEEKDAYS[date.getDay()]})`;
};

const AcademicCalendarPage = () => {
  const [viewYear, setViewYear] = useState(2026);
  const [viewMonth, setViewMonth] = useState(7);

  const monthDate = useMemo(() => new Date(viewYear, viewMonth - 1, 1), [viewYear, viewMonth]);

  const weeks = useMemo(() => {
    const monthStart = startOfMonth(monthDate);
    const monthEnd = endOfMonth(monthDate);
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
  }, [monthDate]);

  const monthEvents = useMemo(
    () =>
      EVENTS.filter((event) => {
        const start = parseISO(event.start);
        const end = parseISO(event.end);
        return start <= endOfMonth(monthDate) && end >= startOfMonth(monthDate);
      }),
    [monthDate]
  );

  const hasEvent = (day) =>
    monthEvents.some((event) =>
      isWithinInterval(day, { start: parseISO(event.start), end: parseISO(event.end) })
    );

  return (
    <div className="calendar_page">
      <Header />
      <div className="calendar_page_title_wrap">
        <h1 className="calendar_page_title">학사일정</h1>
      </div>
      <div className="calendar_page_body">
        <div className="calendar_nav_card">
          <div className="calendar_year_row">
            <button
              className="calendar_year_btn"
              type="button"
              onClick={() => setViewYear((prev) => prev - 1)}
              aria-label="이전 연도"
            >
              <span className="icon icon_chevron_left" aria-hidden="true" />
              {viewYear - 1}
            </button>
            <div className="calendar_year_title">{viewYear}학년도 학사일정</div>
            <button
              className="calendar_year_btn"
              type="button"
              onClick={() => setViewYear((prev) => prev + 1)}
              aria-label="다음 연도"
            >
              {viewYear + 1}
              <span className="icon icon_chevron_right" aria-hidden="true" />
            </button>
          </div>
          <div className="calendar_month_row">
            {MONTHS.map((month) => (
              <button
                key={month}
                className={`calendar_month_btn ${month === viewMonth ? "calendar_month_btn_active" : ""}`}
                type="button"
                onClick={() => setViewMonth(month)}
              >
                {month}월
              </button>
            ))}
          </div>
        </div>

        <div className="calendar_content_row">
          <div className="calendar_grid_card">
            <div className="calendar_grid_head">
              <div className="calendar_grid_head_month">{String(viewMonth).padStart(2, "0")}월</div>
              <div className="calendar_grid_head_year">{format(monthDate, "MMMM").toUpperCase()}</div>
            </div>
            <table className="calendar_grid_table">
              <thead>
                <tr>
                  {WEEKDAYS.map((day, index) => (
                    <th
                      key={day}
                      className={index === 0 ? "weekday_sun" : index === 6 ? "weekday_sat" : ""}
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
                      const inMonth = isSameMonth(day, monthDate);
                      return (
                        <td key={dayIndex}>
                          {inMonth && (
                            <div className={`calendar_day ${isToday(day) ? "calendar_day_today" : ""}`}>
                              <span
                                className={
                                  dayIndex === 0 ? "day_sun" : dayIndex === 6 ? "day_sat" : ""
                                }
                              >
                                {format(day, "d")}
                              </span>
                              {hasEvent(day) && <span className="calendar_day_dot" aria-hidden="true" />}
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

          <div className="calendar_schedule_card">
            {monthEvents.length === 0 ? (
              <div className="calendar_schedule_empty">등록된 학사일정이 없습니다.</div>
            ) : (
              <ul className="calendar_schedule_list">
                {monthEvents.map((event) => (
                  <li
                    key={event.label}
                    className={`calendar_schedule_row ${event.isHoliday ? "calendar_schedule_row_holiday" : ""}`}
                  >
                    <span className="calendar_schedule_date">
                      {isSameDay(parseISO(event.start), parseISO(event.end))
                        ? formatRangeLabel(event.start)
                        : `${formatRangeLabel(event.start)} ~ ${formatRangeLabel(event.end)}`}
                    </span>
                    <span className="calendar_schedule_label">{event.label}</span>
                  </li>
                ))}
              </ul>
            )}
            <p className="calendar_disclaimer">학사일정은 학교 사정에 의해 변동될 수 있습니다.</p>
          </div>
        </div>
      </div>
      <AiChat />
      <Footer />
    </div>
  );
};

export default AcademicCalendarPage;
