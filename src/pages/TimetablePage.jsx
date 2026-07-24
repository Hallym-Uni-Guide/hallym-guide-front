import { useEffect, useMemo, useState } from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import AiChat from "../components/AiChat";
import "../styles/TimetablePage.css";

const DAYS = ["월", "화", "수", "목", "금", "토", "일"];
const GRID_START_HOUR = 9;
const GRID_END_HOUR = 21;
const GRID_HOURS = Array.from(
  { length: GRID_END_HOUR - GRID_START_HOUR },
  (_, index) => GRID_START_HOUR + index
);

const EMPTY_FORM = {
  subject: "",
  professor: "",
  day: DAYS[0],
  startTime: "09:00",
  endTime: "10:00",
  location: "",
};

function buildGrid(classes) {
  const grid = {};
  DAYS.forEach((day) => {
    grid[day] = Array(GRID_HOURS.length).fill(null);
  });

  classes.forEach((classItem) => {
    classItem.schedules.forEach((slot) => {
      if (!grid[slot.day]) return;

      const startHour = Number(slot.startTime.split(":")[0]);
      const endHour = Number(slot.endTime.split(":")[0]);
      const rowStart = Math.max(0, startHour - GRID_START_HOUR);
      const rowSpan = Math.max(1, endHour - startHour);

      if (rowStart >= GRID_HOURS.length) return;

      grid[slot.day][rowStart] = { classItem, slot, span: rowSpan };
      for (let r = rowStart + 1; r < rowStart + rowSpan; r += 1) {
        if (grid[slot.day][r] !== undefined) grid[slot.day][r] = "skip";
      }
    });
  });

  return grid;
}

const TimetablePage = () => {
  const [classes, setClasses] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [form, setForm] = useState(EMPTY_FORM);
  const [formError, setFormError] = useState("");

  useEffect(() => {
    async function loadClasses() {
      setIsLoading(true);
      setError("");

      try {
        const response = await fetch("/api/timetable");
        const result = await response.json();

        if (!response.ok || !result.success) {
          throw new Error(result.message || "시간표를 불러오지 못했습니다.");
        }

        setClasses(result.classes);
      } catch (err) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    }

    loadClasses();
  }, []);

  const grid = useMemo(() => buildGrid(classes), [classes]);

  const updateField = (field) => (event) => {
    setForm((prev) => ({ ...prev, [field]: event.target.value }));
  };

  const handleAddClass = async (event) => {
    event.preventDefault();
    setFormError("");

    if (!form.subject.trim()) {
      setFormError("과목명을 입력해주세요.");
      return;
    }

    if (form.startTime >= form.endTime) {
      setFormError("종료 시간은 시작 시간보다 늦어야 합니다.");
      return;
    }

    try {
      const response = await fetch("/api/timetable", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          subject: form.subject,
          professor: form.professor,
          schedules: [
            {
              day: form.day,
              startTime: form.startTime,
              endTime: form.endTime,
              location: form.location,
            },
          ],
        }),
      });

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(result.message || "수업 추가에 실패했습니다.");
      }

      setClasses((prev) => [...prev, result.class]);
      setForm(EMPTY_FORM);
    } catch (err) {
      setFormError(err.message);
    }
  };

  const handleDeleteClass = async (id) => {
    try {
      const response = await fetch(`/api/timetable/${id}`, {
        method: "DELETE",
      });
      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(result.message || "수업 삭제에 실패했습니다.");
      }

      setClasses((prev) => prev.filter((classItem) => classItem.id !== id));
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="timetable_page">
      <Header />
      <div className="timetable_body">
        <form className="timetable_filter_bar" onSubmit={handleAddClass}>
          <div className="filter_field">
            <label>과목명</label>
            <div className="filter_search_input_wrap">
              <input
                type="text"
                placeholder="과목명"
                value={form.subject}
                onChange={updateField("subject")}
              />
            </div>
          </div>
          <div className="filter_field">
            <label>교수명</label>
            <div className="filter_search_input_wrap">
              <input
                type="text"
                placeholder="교수명"
                value={form.professor}
                onChange={updateField("professor")}
              />
            </div>
          </div>
          <div className="filter_field">
            <label>요일</label>
            <select value={form.day} onChange={updateField("day")}>
              {DAYS.map((day) => (
                <option key={day} value={day}>
                  {day}
                </option>
              ))}
            </select>
          </div>
          <div className="filter_field">
            <label>시작 시간</label>
            <input
              type="time"
              value={form.startTime}
              onChange={updateField("startTime")}
            />
          </div>
          <div className="filter_field">
            <label>종료 시간</label>
            <input
              type="time"
              value={form.endTime}
              onChange={updateField("endTime")}
            />
          </div>
          <div className="filter_field">
            <label>강의실</label>
            <div className="filter_search_input_wrap">
              <input
                type="text"
                placeholder="강의실"
                value={form.location}
                onChange={updateField("location")}
              />
            </div>
          </div>
          <button className="filter_search_btn" type="submit">
            수업 추가
          </button>
        </form>

        {formError && <p className="timetable_form_error">{formError}</p>}

        <div className="timetable_grid_row">
          <section className="course_result_panel">
            <h3 className="panel_title">
              내 수업 목록 <span className="panel_title_count">총 {classes.length}개</span>
            </h3>

            {isLoading && <p className="timetable_empty_message">불러오는 중입니다...</p>}
            {!isLoading && error && <p className="timetable_empty_message">{error}</p>}
            {!isLoading && !error && classes.length === 0 && (
              <p className="timetable_empty_message">등록된 수업이 없습니다.</p>
            )}

            {!isLoading && !error && classes.length > 0 && (
              <table className="course_result_table">
                <thead>
                  <tr>
                    <th>과목</th>
                    <th>교수</th>
                    <th>시간/강의실</th>
                    <th>삭제</th>
                  </tr>
                </thead>
                <tbody>
                  {classes.map((classItem) => (
                    <tr key={classItem.id}>
                      <td className="course_name_cell">{classItem.subject}</td>
                      <td>{classItem.professor}</td>
                      <td className="course_schedule_cell">
                        {classItem.schedules.map((slot, index) => (
                          <span key={index}>
                            {index > 0 && <br />}
                            {slot.day} {slot.startTime}-{slot.endTime} {slot.location}
                          </span>
                        ))}
                      </td>
                      <td>
                        <button
                          className="add_course_btn"
                          type="button"
                          onClick={() => handleDeleteClass(classItem.id)}
                          aria-label="수업 삭제"
                        >
                          <span className="icon icon_close" aria-hidden="true" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </section>

          <section className="timetable_preview_panel">
            <h3 className="panel_title">
              시간표 미리보기 <span className="panel_title_count">담은 수업 {classes.length}개</span>
            </h3>
            <table className="timetable_grid_table">
              <thead>
                <tr>
                  <th />
                  {DAYS.map((day) => (
                    <th key={day}>{day}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {GRID_HOURS.map((hour, rowIndex) => (
                  <tr key={hour}>
                    <th className="timetable_period_label">{hour}</th>
                    {DAYS.map((day) => {
                      const cell = grid[day][rowIndex];
                      if (cell === "skip") return null;
                      if (cell) {
                        return (
                          <td key={day} rowSpan={cell.span} className="timetable_cell_filled">
                            <div className="timetable_cell_name">{cell.classItem.subject}</div>
                            <div className="timetable_cell_room">{cell.slot.location}</div>
                          </td>
                        );
                      }
                      return <td key={day} className="timetable_cell_empty" />;
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </section>
        </div>
      </div>
      <AiChat />
      <Footer />
    </div>
  );
};

export default TimetablePage;
