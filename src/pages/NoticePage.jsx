import { useMemo, useState } from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import AiChat from "../components/AiChat";
import "../styles/NoticePage.css";

const FILTER_TABS = ["전체보기", "일반", "행사", "국제", "취업/창업"];

const NOTICES = [
  { id: 4584, category: "일반", title: "한림대학교 창업보육센터 신규 입주기업 모집 공고", date: "2026-07-15" },
  { id: 4583, category: "일반", title: "[제38회 춘천인형극제] 자원봉사자 '코코미' 모집 홍보", date: "2026-07-15" },
  { id: 4582, category: "일반", title: "[한림봉사센터] 2026-1학기 한림BeCome 마일리지 신청 안내", date: "2026-07-15" },
  { id: 4581, category: "취업/창업", title: "2026 제약·바이오 취업 역량강화 「K-바이오 리더양성」 참여자 모집 안내", date: "2026-07-14" },
  { id: 4580, category: "일반", title: "2026-2학기 학생생활관 재학생 추가 입사신청 안내", date: "2026-07-14" },
  { id: 4579, category: "일반", title: "[교육혁신센터] 「2026학년도 1학기 교수역량 진단 설문조사」 시행 안내(~8/31까지)", date: "2026-07-13" },
  { id: 4578, category: "일반", title: "[교육혁신센터] 「2026학년도 대학 교수자의 AI 교수역량 측정 도구 설문조사」 시행 안", date: "2026-07-13" },
  { id: 4577, category: "일반", title: "[인사혁신처] 국가인재데이터베이스 인물정보 업데이트 안내", date: "2026-07-09" },
  { id: 4576, category: "취업/창업", title: "[춘천시공연예술창업지원센터] 2026 공연 콘텐츠 발굴 선공개 '합케이스&apos'", date: "2026-07-08" },
  { id: 4575, category: "일반", title: "대학생 및 외국인 유학생 대상 PM·이륜차 사고 예방 안내", date: "2026-07-08" },
];

const TOTAL_COUNT = 4584;
const TOTAL_PAGES = 10;

const NoticePage = () => {
  const [keyword, setKeyword] = useState("");
  const [activeTab, setActiveTab] = useState("전체보기");
  const [page, setPage] = useState(1);

  const pages = useMemo(
    () => Array.from({ length: TOTAL_PAGES }, (_, i) => i + 1),
    []
  );

  const visibleNotices =
    activeTab === "전체보기"
      ? NOTICES
      : NOTICES.filter((notice) => notice.category === activeTab);

  return (
    <div className="notice_page">
      <Header />
      <div className="notice_body">
        <aside className="notice_sidebar">
          <div className="notice_sidebar_group">
            <h3>학교소식</h3>
            <div className="notice_sidebar_divider" />
            <nav className="notice_sidebar_nav">
              <span className="notice_sidebar_link notice_sidebar_link_active">공지사항</span>
              <span className="notice_sidebar_link">자주 묻는 질문</span>
            </nav>
          </div>
        </aside>

        <main className="notice_main">
          <div className="notice_head_row">
            <h1 className="notice_title">일반공지</h1>
            <form className="notice_search_bar" onSubmit={(event) => event.preventDefault()}>
              <input
                className="notice_search_input"
                type="search"
                placeholder="검색어 입력"
                value={keyword}
                onChange={(event) => setKeyword(event.target.value)}
              />
              <button className="notice_search_btn" type="submit" aria-label="검색">
                <span className="icon icon_search" aria-hidden="true" />
              </button>
            </form>
          </div>

          <div className="notice_filter_tabs">
            {FILTER_TABS.map((tab) => (
              <button
                key={tab}
                className={`notice_filter_tab ${activeTab === tab ? "notice_filter_tab_active" : ""}`}
                type="button"
                onClick={() => {
                  setActiveTab(tab);
                  setPage(1);
                }}
              >
                {tab}
              </button>
            ))}
          </div>

          <div className="notice_meta_row">
            <span>총 게시물 : {TOTAL_COUNT}개</span>
            <span>페이지 : {page}/{TOTAL_PAGES}</span>
          </div>

          <table className="notice_table">
            <colgroup>
              <col style={{ width: "10%" }} />
              <col />
              <col style={{ width: "16%" }} />
            </colgroup>
            <thead>
              <tr>
                <th>번호</th>
                <th className="notice_table_title_head">제목</th>
                <th>작성일</th>
              </tr>
            </thead>
            <tbody>
              {visibleNotices.map((notice) => (
                <tr key={notice.id}>
                  <td className="notice_table_id">{notice.id}</td>
                  <td className="notice_table_title">
                    <span
                      className={`category_badge ${
                        notice.category === "취업/창업" ? "category_badge_job" : "category_badge_general"
                      }`}
                    >
                      {notice.category}
                    </span>
                    {notice.title}
                  </td>
                  <td className="notice_table_date">{notice.date}</td>
                </tr>
              ))}
            </tbody>
          </table>

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
      <AiChat />
      <Footer />
    </div>
  );
};

export default NoticePage;
