import { useMemo, useState } from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import AiChat from "../components/AiChat";
import { majors } from "../data/majors";
import "../styles/TimetablePage.css";

const TERMS = ["2026학년도 2학기", "2026학년도 1학기", "2025학년도 2학기", "2025학년도 1학기"];
const DAYS = ["월", "화", "수", "목", "금"];
const PERIODS = Array.from({ length: 11 }, (_, i) => i);
const MAX_CREDIT = 21;

const COURSES = [
  { id: 1, category: "전공필수", name: "SW창의설계", professor: "홍○○", credit: 1, room: "7101", schedule: [{ day: "월", start: 1, end: 2 }] },
  { id: 2, category: "전공선택", name: "디지털리터러시", professor: "유○○", credit: 3, room: "4107", schedule: [{ day: "화", start: 3, end: 4 }] },
  { id: 3, category: "교양선택", name: "정상역학개론", professor: "권○○", credit: 3, room: "9404", schedule: [{ day: "수", start: 3, end: 5 }] },
  { id: 4, category: "전공선택", name: "인간공학개론", professor: "윤○○", credit: 1, room: "ONLINE", schedule: [] },
  { id: 5, category: "전공필수", name: "데이터분석기초", professor: "류○○", credit: 3, room: "7105", schedule: [{ day: "목", start: 6, end: 7 }] },
  { id: 6, category: "교양선택", name: "서비스디자인", professor: "권○○", credit: 3, room: "7105", schedule: [{ day: "금", start: 4, end: 6 }] },
  { id: 7, category: "전공선택", name: "네트워크기초", professor: "윤○○", credit: 3, room: "9404", schedule: [{ day: "월", start: 4, end: 6 }] },
  { id: 8, category: "교양선택", name: "정보문화의 이해", professor: "김○○", credit: 3, room: "미정", schedule: [{ day: "화", start: 1, end: 2 }] },
];

const CATEGORY_CLASS = {
  전공필수: "category_required_major",
  전공선택: "category_elective_major",
  교양필수: "category_required_general",
  교양선택: "category_elective_general",
};

const formatSchedule = (schedule, room) => {
  if (schedule.length === 0) return room;
  return `${schedule.map((s) => (s.start === s.end ? `${s.day} ${s.start}` : `${s.day} ${s.start}-${s.end}`)).join(", ")}\n${room}`;
};

const hasConflict = (schedule, existingCourses) =>
  existingCourses.some((course) =>
    course.schedule.some((slotA) =>
      schedule.some(
        (slotB) => slotA.day === slotB.day && slotA.start <= slotB.end && slotB.start <= slotA.end
      )
    )
  );

const buildGrid = (selectedCourses) => {
  const grid = {};
  DAYS.forEach((day) => {
    grid[day] = Array(PERIODS.length).fill(null);
  });
  selectedCourses.forEach((course) => {
    course.schedule.forEach(({ day, start, end }) => {
      if (!grid[day]) return;
      grid[day][start] = { course, span: end - start + 1 };
      for (let p = start + 1; p <= end; p += 1) {
        grid[day][p] = "skip";
      }
    });
  });
  return grid;
};

const TimetablePage = () => {
  const [term, setTerm] = useState(TERMS[0]);
  const [major, setMajor] = useState("전체 전공");
  const [searchInput, setSearchInput] = useState("");
  const [query, setQuery] = useState("");
  const [selectedIds, setSelectedIds] = useState([]);

  const filteredCourses = useMemo(() => {
    if (!query.trim()) return COURSES;
    const lower = query.trim().toLowerCase();
    return COURSES.filter(
      (course) =>
        course.name.toLowerCase().includes(lower) ||
        course.professor.toLowerCase().includes(lower) ||
        course.room.toLowerCase().includes(lower)
    );
  }, [query]);

  const selectedCourses = useMemo(
    () => COURSES.filter((course) => selectedIds.includes(course.id)),
    [selectedIds]
  );

  const grid = useMemo(() => buildGrid(selectedCourses), [selectedCourses]);

  const totalCredit = selectedCourses.reduce((sum, course) => sum + course.credit, 0);
  const majorCredit = selectedCourses
    .filter((course) => course.category.startsWith("전공"))
    .reduce((sum, course) => sum + course.credit, 0);
  const generalCredit = selectedCourses
    .filter((course) => course.category.startsWith("교양"))
    .reduce((sum, course) => sum + course.credit, 0);

  const handleSearchSubmit = (event) => {
    event.preventDefault();
    setQuery(searchInput);
  };

  const handleResetFilters = () => {
    setTerm(TERMS[0]);
    setMajor("전체 전공");
    setSearchInput("");
    setQuery("");
  };

  const handleResetTimetable = () => {
    setSelectedIds([]);
  };

  const toggleCourse = (course) => {
    const isSelected = selectedIds.includes(course.id);
    if (isSelected) {
      setSelectedIds((prev) => prev.filter((id) => id !== course.id));
      return;
    }
    if (course.schedule.length > 0 && hasConflict(course.schedule, selectedCourses)) {
      window.alert("다른 수업과 시간이 겹칩니다.");
      return;
    }
    setSelectedIds((prev) => [...prev, course.id]);
  };

  const handleSaveTimetable = () => {
    window.alert("시간표가 저장되었습니다.");
  };

  return (
    <div className="timetable_page">
      <Header />
      <div className="timetable_body">
        <form className="timetable_filter_bar" onSubmit={handleSearchSubmit}>
          <div className="filter_field">
            <label>학년도/학기</label>
            <select value={term} onChange={(event) => setTerm(event.target.value)}>
              {TERMS.map((t) => (
                <option key={t} value={t}>
                  {t}
                </option>
              ))}
            </select>
          </div>
          <div className="filter_field">
            <label>전공</label>
            <select value={major} onChange={(event) => setMajor(event.target.value)}>
              <option value="전체 전공">전체 전공</option>
              {majors.map((m) => (
                <option key={m} value={m}>
                  {m}
                </option>
              ))}
            </select>
          </div>
          <div className="filter_field filter_field_search">
            <label>과목명, 교수명, 강의실 검색</label>
            <div className="filter_search_input_wrap">
              <input
                type="text"
                placeholder="과목명, 교수명, 강의실을 검색해보세요."
                value={searchInput}
                onChange={(event) => setSearchInput(event.target.value)}
              />
              <span className="icon icon_search" aria-hidden="true" />
            </div>
          </div>
          <button className="filter_search_btn" type="submit">
            검색하기
          </button>
          <button className="filter_reset_btn" type="button" onClick={handleResetFilters}>
            초기화
          </button>
        </form>

        <div className="timetable_grid_row">
          <section className="course_result_panel">
            <h3 className="panel_title">
              수업 검색 결과 <span className="panel_title_count">총 {filteredCourses.length}건</span>
            </h3>
            <table className="course_result_table">
              <thead>
                <tr>
                  <th>구분</th>
                  <th>과목</th>
                  <th>교수</th>
                  <th>학점</th>
                  <th>시간/강의실</th>
                  <th>담기</th>
                </tr>
              </thead>
              <tbody>
                {filteredCourses.map((course) => {
                  const isSelected = selectedIds.includes(course.id);
                  return (
                    <tr key={course.id}>
                      <td>
                        <span className={`category_badge ${CATEGORY_CLASS[course.category]}`}>
                          {course.category}
                        </span>
                      </td>
                      <td className="course_name_cell">{course.name}</td>
                      <td>{course.professor}</td>
                      <td>{course.credit}</td>
                      <td className="course_schedule_cell">
                        {formatSchedule(course.schedule, course.room)
                          .split("\n")
                          .map((line, index) => (
                            <span key={index}>
                              {index > 0 && <br />}
                              {line}
                            </span>
                          ))}
                      </td>
                      <td>
                        <button
                          className={`add_course_btn ${isSelected ? "add_course_btn_active" : ""}`}
                          type="button"
                          onClick={() => toggleCourse(course)}
                          aria-label={isSelected ? "시간표에서 제거" : "시간표에 담기"}
                        >
                          <span
                            className={`icon ${isSelected ? "icon_check" : "icon_plus"}`}
                            aria-hidden="true"
                          />
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
            <div className="course_pagination">
              <button className="course_page_btn" type="button" disabled>
                <span className="icon icon_chevron_left" aria-hidden="true" />
              </button>
              {[1, 2, 3, 4].map((pageNum) => (
                <button
                  key={pageNum}
                  className={`course_page_btn ${pageNum === 1 ? "course_page_btn_active" : ""}`}
                  type="button"
                >
                  {pageNum}
                </button>
              ))}
              <button className="course_page_btn" type="button">
                <span className="icon icon_chevron_right" aria-hidden="true" />
              </button>
            </div>
          </section>

          <section className="timetable_preview_panel">
            <h3 className="panel_title">
              시간표 미리보기 <span className="panel_title_count">담은 수업 {selectedCourses.length}개</span>
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
                {PERIODS.map((period) => (
                  <tr key={period}>
                    <th className="timetable_period_label">{period}</th>
                    {DAYS.map((day) => {
                      const cell = grid[day][period];
                      if (cell === "skip") return null;
                      if (cell) {
                        return (
                          <td key={day} rowSpan={cell.span} className="timetable_cell_filled">
                            <div className="timetable_cell_name">{cell.course.name}</div>
                            <div className="timetable_cell_room">{cell.course.room}</div>
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

          <section className="credit_status_panel">
            <h3 className="panel_title">학점 현황</h3>
            <div className="credit_status_group">
              <span className="credit_status_label">신청 학점</span>
              <span className="credit_status_value">
                {totalCredit} / {MAX_CREDIT}학점
              </span>
            </div>
            <div className="credit_status_group">
              <span className="credit_status_label">전공 학점</span>
              <span className="credit_status_value">{majorCredit}학점</span>
            </div>
            <div className="credit_status_group">
              <span className="credit_status_label">교양 학점</span>
              <span className="credit_status_value">{generalCredit}학점</span>
            </div>
            <div className="credit_status_group">
              <span className="credit_status_label">시간표 상태</span>
              <span className="credit_status_note">겹치는 수업이 없습니다.</span>
            </div>
            <div className="credit_status_actions">
              <button className="timetable_reset_btn" type="button" onClick={handleResetTimetable}>
                초기화
              </button>
              <button className="timetable_save_btn" type="button" onClick={handleSaveTimetable}>
                시간표 저장
              </button>
            </div>
          </section>
        </div>
      </div>
      <AiChat />
      <Footer />
    </div>
  );
};

export default TimetablePage;
