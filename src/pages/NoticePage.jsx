import { useEffect, useState } from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import AiChat from "../components/AiChat";
import "../styles/NoticePage.css";

const FILTER_TABS = [
  { key: "전체보기", category: "general", subCategory: "all" },
  { key: "일반", category: "general", subCategory: "normal" },
  { key: "행사", category: "event", subCategory: null },
  { key: "국제", category: "general", subCategory: "international" },
  { key: "취업/창업", category: "general", subCategory: "employment" },
];

const NOTICE_LIMIT = 20;

const NoticePage = () => {
  const [keyword, setKeyword] = useState("");
  const [activeTab, setActiveTab] = useState(FILTER_TABS[0].key);
  const [notices, setNotices] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  const tab = FILTER_TABS.find((item) => item.key === activeTab);

  useEffect(() => {
    async function loadNotices() {
      setIsLoading(true);
      setError("");

      try {
        const params = new URLSearchParams({
          category: tab.category,
          limit: String(NOTICE_LIMIT),
        });

        if (tab.subCategory) {
          params.set("subCategory", tab.subCategory);
        }

        const response = await fetch(`/api/notices?${params.toString()}`);
        const result = await response.json();

        if (!response.ok || !result.success) {
          throw new Error(result.message || "공지사항을 불러오지 못했습니다.");
        }

        setNotices(result.data);
      } catch (err) {
        setError(err.message);
        setNotices([]);
      } finally {
        setIsLoading(false);
      }
    }

    loadNotices();
  }, [tab.category, tab.subCategory]);

  const visibleNotices = keyword.trim()
    ? notices.filter((notice) =>
        notice.title.toLowerCase().includes(keyword.trim().toLowerCase())
      )
    : notices;

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
            <h1 className="notice_title">공지사항</h1>
            <form className="notice_search_bar" onSubmit={(event) => event.preventDefault()}>
              <input
                className="notice_search_input"
                type="search"
                placeholder="불러온 목록 내 검색"
                value={keyword}
                onChange={(event) => setKeyword(event.target.value)}
              />
              <button className="notice_search_btn" type="submit" aria-label="검색">
                <span className="icon icon_search" aria-hidden="true" />
              </button>
            </form>
          </div>

          <div className="notice_filter_tabs">
            {FILTER_TABS.map((item) => (
              <button
                key={item.key}
                className={`notice_filter_tab ${activeTab === item.key ? "notice_filter_tab_active" : ""}`}
                type="button"
                onClick={() => setActiveTab(item.key)}
              >
                {item.key}
              </button>
            ))}
          </div>

          <div className="notice_meta_row">
            <span>불러온 게시물 : {visibleNotices.length}개</span>
          </div>

          {isLoading && <p className="notice_empty_message">불러오는 중입니다...</p>}
          {!isLoading && error && <p className="notice_empty_message">{error}</p>}
          {!isLoading && !error && visibleNotices.length === 0 && (
            <p className="notice_empty_message">공지사항이 없습니다.</p>
          )}

          {!isLoading && !error && visibleNotices.length > 0 && (
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
                  <tr key={notice.url + notice.id}>
                    <td className="notice_table_id">{notice.id}</td>
                    <td className="notice_table_title">
                      <span
                        className={`category_badge ${
                          activeTab === "취업/창업" ? "category_badge_job" : "category_badge_general"
                        }`}
                      >
                        {notice.subCategoryName || notice.categoryName}
                      </span>
                      <a href={notice.url} target="_blank" rel="noreferrer">
                        {notice.title}
                      </a>
                    </td>
                    <td className="notice_table_date">{notice.date}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </main>
      </div>
      <AiChat />
      <Footer />
    </div>
  );
};

export default NoticePage;
