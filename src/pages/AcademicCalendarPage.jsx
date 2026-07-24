import { useEffect, useMemo, useState } from "react";
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

const formatRangeLabel = (dateStr) => {
  const date = parseISO(dateStr);
  return `${format(date, "yyyy.MM.dd")}(${WEEKDAYS[date.getDay()]})`;
};

const EMPTY_PERSONAL_FORM = { title: "", date: "", description: "" };

const AcademicCalendarPage = () => {
  const [viewYear, setViewYear] = useState(2026);
  const [viewMonth, setViewMonth] = useState(7);

  const [academicEvents, setAcademicEvents] = useState([]);
  const [isAcademicLoading, setIsAcademicLoading] = useState(true);
  const [academicError, setAcademicError] = useState("");

  const [personalSchedules, setPersonalSchedules] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [form, setForm] = useState(EMPTY_PERSONAL_FORM);
  const [formError, setFormError] = useState("");

  const monthDate = useMemo(() => new Date(viewYear, viewMonth - 1, 1), [viewYear, viewMonth]);

  useEffect(() => {
    async function loadAcademicEvents() {
      setIsAcademicLoading(true);
      setAcademicError("");

      try {
        const response = await fetch(
          `/api/academic-calendar?year=${viewYear}&month=${viewMonth}`
        );
        const result = await response.json();

        if (!response.ok || !result.success) {
          throw new Error(result.message || "학사일정을 불러오지 못했습니다.");
        }

        setAcademicEvents(result.events);
      } catch (err) {
        setAcademicError(err.message);
        setAcademicEvents([]);
      } finally {
        setIsAcademicLoading(false);
      }
    }

    loadAcademicEvents();
  }, [viewYear, viewMonth]);

  useEffect(() => {
    async function loadSchedules() {
      setIsLoading(true);
      setError("");

      try {
        const response = await fetch(`/api/schedules?year=${viewYear}&month=${viewMonth}`);
        const result = await response.json();

        if (!response.ok || !result.success) {
          throw new Error(result.message || "내 일정을 불러오지 못했습니다.");
        }

        setPersonalSchedules(result.schedules);
      } catch (err) {
        setError(err.message);
        setPersonalSchedules([]);
      } finally {
        setIsLoading(false);
      }
    }

    loadSchedules();
  }, [viewYear, viewMonth]);

  const updateField = (field) => (event) => {
    setForm((prev) => ({ ...prev, [field]: event.target.value }));
  };

  const handleAddSchedule = async (event) => {
    event.preventDefault();
    setFormError("");

    if (!form.title.trim() || !form.date) {
      setFormError("일정 제목과 날짜를 입력해주세요.");
      return;
    }

    try {
      const response = await fetch("/api/schedules", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(result.message || "일정 추가에 실패했습니다.");
      }

      const scheduleYear = Number(result.schedule.date.slice(0, 4));
      const scheduleMonth = Number(result.schedule.date.slice(5, 7));

      if (scheduleYear === viewYear && scheduleMonth === viewMonth) {
        setPersonalSchedules((prev) => [...prev, result.schedule]);
      }

      setForm(EMPTY_PERSONAL_FORM);
    } catch (err) {
      setFormError(err.message);
    }
  };

  const handleDeleteSchedule = async (id) => {
    try {
      const response = await fetch(`/api/schedules/${id}`, { method: "DELETE" });
      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(result.message || "일정 삭제에 실패했습니다.");
      }

      setPersonalSchedules((prev) => prev.filter((schedule) => schedule.id !== id));
    } catch (err) {
      setError(err.message);
    }
  };

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

  const hasEvent = (day) =>
    academicEvents.some((event) =>
      isWithinInterval(day, { start: parseISO(event.start), end: parseISO(event.end) })
    );

  const hasPersonalSchedule = (day) =>
    personalSchedules.some((schedule) => isSameDay(day, parseISO(schedule.date)));

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
                              <div className="calendar_day_dot_row">
                                {hasEvent(day) && (
                                  <div className="calendar_day_dot" aria-hidden="true" />
                                )}
                                {hasPersonalSchedule(day) && (
                                  <div className="calendar_day_dot calendar_day_dot_personal" aria-hidden="true" />
                                )}
                              </div>
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
            {isAcademicLoading && (
              <div className="calendar_schedule_empty">불러오는 중입니다...</div>
            )}
            {!isAcademicLoading && academicError && (
              <div className="calendar_schedule_empty">{academicError}</div>
            )}
            {!isAcademicLoading && !academicError && academicEvents.length === 0 && (
              <div className="calendar_schedule_empty">등록된 학사일정이 없습니다.</div>
            )}
            {!isAcademicLoading && !academicError && academicEvents.length > 0 && (
              <ul className="calendar_schedule_list">
                {academicEvents.map((event) => (
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

        <div className="calendar_personal_card">
          <h2 className="calendar_personal_title">내 일정</h2>

          <form className="calendar_personal_form" onSubmit={handleAddSchedule}>
            <input
              type="text"
              placeholder="일정 제목"
              value={form.title}
              onChange={updateField("title")}
            />
            <input type="date" value={form.date} onChange={updateField("date")} />
            <input
              type="text"
              placeholder="메모 (선택)"
              value={form.description}
              onChange={updateField("description")}
            />
            <button type="submit">일정 추가</button>
          </form>

          {formError && <p className="calendar_personal_error">{formError}</p>}

          {isLoading && <p className="calendar_schedule_empty">불러오는 중입니다...</p>}
          {!isLoading && error && <p className="calendar_schedule_empty">{error}</p>}
          {!isLoading && !error && personalSchedules.length === 0 && (
            <p className="calendar_schedule_empty">
              {viewYear}년 {viewMonth}월에 등록된 내 일정이 없습니다.
            </p>
          )}

          {!isLoading && !error && personalSchedules.length > 0 && (
            <ul className="calendar_schedule_list">
              {personalSchedules.map((schedule) => (
                <li className="calendar_schedule_row" key={schedule.id}>
                  <span className="calendar_schedule_date">{schedule.date}</span>
                  <span className="calendar_schedule_label">
                    {schedule.title}
                    {schedule.description && ` — ${schedule.description}`}
                  </span>
                  <button
                    className="calendar_personal_delete_btn"
                    type="button"
                    onClick={() => handleDeleteSchedule(schedule.id)}
                    aria-label="일정 삭제"
                  >
                    <span className="icon icon_close" aria-hidden="true" />
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
      <AiChat />
      <Footer />
    </div>
  );
};

export default AcademicCalendarPage;
