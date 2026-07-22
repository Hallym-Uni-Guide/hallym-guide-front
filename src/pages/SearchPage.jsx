import { useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import Header from "../components/Header";
import Footer from "../components/Footer";
import AiChat from "../components/AiChat";
import "../styles/SearchPage.css";

const FILTER_OPTIONS = [
  "신청/접수",
  "방법/절차",
  "기간/일정",
  "서류/양식",
  "자격/대상",
  "유의사항",
];

const RESULTS = [
  {
    id: 1,
    path: ["학사안내", "학적", "휴학 및 복학"],
    desc: "휴학의 구분 : 일반휴학, 입대휴학, 창업휴학 및 임신·출산·육아휴학\n1. 일반휴학을 하고자 하는 학생은 보호자와 연서로 휴학원을 작성하여, 지도교수 및 소속 스쿨의 학장, 학부(과)장의 허가를 받은 후 소속 단과대학 교학팀에 제출하여야 한다.",
  },
  {
    id: 2,
    path: ["학사안내", "학적"],
    desc: "받고자 하는 학생은 수료유예등록, 수료 후 논문지도등록과는 별도로 심사신청 후에 논문심사료를 납부하여야 한다. 등록금의 반환 (Tuition Refund) 휴학·자퇴 등으로 학업을 계속할 수 없는 경우, 다음에 따라 해당금액을 반환한다.",
  },
  {
    id: 3,
    path: ["학사안내", "학사정보", "증명서 발급"],
    desc: "(문의 : 학생지원팀 033-248-1071) 증명서 구분 : 재학, 휴학, 성적, 성적이수, 졸업예정, 수료예정, 학위수여예정, 유예, 장학금(비)수혜, 교직이수, 학위논문심사. 증명수수료 : 학적부 등 500원.",
  },
  {
    id: 4,
    title: "2026학년도 2학기 사회복지대학원 휴학, 복학 신청 안내",
    desc: "안녕하세요 사회복지대학원 입니다. 2026학년도 2학기 휴학 및 복학 신청 기간을 아래와 같이 안내해 드리오니, 휴·복학 예정자는 상단의 첨부파일을 다운로드하여 기한 내에 제출 부탁드립니다.",
  },
  {
    id: 5,
    title: "2026-2학기 학생생활관 재학생 추가 입사신청 안내",
    desc: "대학원, 교환학생, 어학연수생, 복학예정자 대기자 모집을 위한 신청이며, 최초 신청자 (06.15~07.05)는 신청 불가. 미복학하거나 개강 후 휴학할 경우 퇴사조치되며 환불규정에 의거하여 환불함 (\"학생생활관 규정 제 23조 (납입금 환불)\" 적용 ).",
  },
];

const TOTAL_COUNT = 742;
const TOTAL_PAGES = 10;

function highlightText(text, keyword) {
  if (!keyword) return text;
  const escaped = keyword.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const parts = text.split(new RegExp(`(${escaped})`, "g"));
  return parts.map((part, index) =>
    part === keyword ? (
      <mark className="keyword_mark" key={index}>
        {part}
      </mark>
    ) : (
      <span key={index}>{part}</span>
    )
  );
}

const SearchPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const keyword = searchParams.get("q") || "휴학";
  const [inputValue, setInputValue] = useState(keyword);
  const [checkedFilters, setCheckedFilters] = useState(["신청/접수"]);
  const [isFilterOpen, setIsFilterOpen] = useState(true);
  const [sortOrder, setSortOrder] = useState("relevance");
  const [page, setPage] = useState(1);

  const pages = useMemo(
    () => Array.from({ length: TOTAL_PAGES }, (_, i) => i + 1),
    []
  );

  const toggleFilter = (option) => {
    setCheckedFilters((prev) =>
      prev.includes(option)
        ? prev.filter((item) => item !== option)
        : [...prev, option]
    );
  };

  const resetFilters = () => setCheckedFilters([]);

  const handleSearchSubmit = (event) => {
    event.preventDefault();
    setSearchParams(inputValue ? { q: inputValue } : {});
  };

  return (
    <div className="search_page">
      <Header />
      <div className="search_page_body">
        <form className="search_bar_wrap" onSubmit={handleSearchSubmit}>
          <input
            className="search_bar_input"
            type="search"
            placeholder="검색어 입력"
            value={inputValue}
            onChange={(event) => setInputValue(event.target.value)}
          />
          <button className="search_bar_btn" type="submit" aria-label="검색">
            <span className="icon icon_search" aria-hidden="true" />
          </button>
        </form>

        <div className="search_content">
          <aside className="search_filter">
            <div className="filter_top_row">
              <h3>검색필터</h3>
              <button className="filter_reset_btn" type="button" onClick={resetFilters}>
                초기화
                <span className="icon icon_refresh" aria-hidden="true" />
              </button>
            </div>
            <div className="filter_divider" />
            <div className="filter_group">
              <button
                className="filter_group_header"
                type="button"
                onClick={() => setIsFilterOpen((prev) => !prev)}
              >
                <span>
                  검색대상
                  <span className="filter_count_badge">{checkedFilters.length}</span>
                </span>
                <span
                  className={`icon icon_chevron ${isFilterOpen ? "icon_chevron_up" : "icon_chevron_down"}`}
                  aria-hidden="true"
                />
              </button>
              {isFilterOpen && (
                <ul className="filter_checkbox_list">
                  {FILTER_OPTIONS.map((option) => (
                    <li key={option}>
                      <label className="filter_checkbox_label">
                        <input
                          type="checkbox"
                          checked={checkedFilters.includes(option)}
                          onChange={() => toggleFilter(option)}
                        />
                        <span className="filter_checkbox_box" aria-hidden="true" />
                        {option}
                      </label>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </aside>

          <main className="search_results">
            <div className="results_head">
              <div className="results_count">
                검색 결과 <strong>{TOTAL_COUNT}개</strong>
              </div>
              <div className="results_sort">
                <span className="results_sort_label">정렬기준</span>
                <button
                  className={`sort_btn ${sortOrder === "relevance" ? "sort_btn_active" : ""}`}
                  type="button"
                  onClick={() => setSortOrder("relevance")}
                >
                  관련도순
                </button>
                <button
                  className={`sort_btn ${sortOrder === "latest" ? "sort_btn_active" : ""}`}
                  type="button"
                  onClick={() => setSortOrder("latest")}
                >
                  최신순
                </button>
                <button className="sort_btn sort_btn_more" type="button" disabled>
                  더보기
                </button>
              </div>
            </div>
            <div className="results_divider" />

            <ul className="result_list">
              {RESULTS.map((result) => (
                <li className="result_item" key={result.id}>
                  {result.path ? (
                    <p className="result_path">
                      {result.path.map((segment, index) => (
                        <span key={index}>
                          {index > 0 && <span className="result_path_sep"> &gt; </span>}
                          {highlightText(segment, keyword)}
                        </span>
                      ))}
                    </p>
                  ) : (
                    <p className="result_title">{highlightText(result.title, keyword)}</p>
                  )}
                  <p className="result_desc">
                    {result.desc.split("\n").map((line, index) => (
                      <span key={index}>
                        {index > 0 && <br />}
                        {highlightText(line, keyword)}
                      </span>
                    ))}
                    {" "}···
                  </p>
                </li>
              ))}
            </ul>

            <nav className="pagination" aria-label="페이지네이션">
              <button
                className="page_btn page_btn_edge"
                type="button"
                disabled={page === 1}
                onClick={() => setPage(1)}
                aria-label="첫 페이지"
              >
                <span className="icon icon_chevrons_left" aria-hidden="true" />
              </button>
              <button
                className="page_btn page_btn_edge"
                type="button"
                disabled={page === 1}
                onClick={() => setPage((prev) => Math.max(1, prev - 1))}
                aria-label="이전 페이지"
              >
                <span className="icon icon_chevron_left" aria-hidden="true" />
              </button>
              {pages.map((pageNum) => (
                <button
                  key={pageNum}
                  className={`page_btn ${page === pageNum ? "page_btn_active" : ""}`}
                  type="button"
                  onClick={() => setPage(pageNum)}
                >
                  {pageNum}
                </button>
              ))}
              <button
                className="page_btn page_btn_edge"
                type="button"
                disabled={page === TOTAL_PAGES}
                onClick={() => setPage((prev) => Math.min(TOTAL_PAGES, prev + 1))}
                aria-label="다음 페이지"
              >
                <span className="icon icon_chevron_right" aria-hidden="true" />
              </button>
              <button
                className="page_btn page_btn_edge"
                type="button"
                disabled={page === TOTAL_PAGES}
                onClick={() => setPage(TOTAL_PAGES)}
                aria-label="마지막 페이지"
              >
                <span className="icon icon_chevrons_right" aria-hidden="true" />
              </button>
            </nav>
          </main>
        </div>
      </div>
      <AiChat />
      <Footer />
    </div>
  );
};

export default SearchPage;
