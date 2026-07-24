import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import Header from "../components/Header";
import Footer from "../components/Footer";
import AiChat from "../components/AiChat";
import "../styles/SearchPage.css";

const TYPE_OPTIONS = [
  { key: "all", label: "전체" },
  { key: "notice", label: "공지사항" },
  { key: "schoolLife", label: "학교생활" },
  { key: "campus", label: "캠퍼스" },
  { key: "schedule", label: "학사일정" },
];

function highlightText(text, keyword) {
  if (!keyword) return text;
  const escaped = keyword.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const parts = String(text).split(new RegExp(`(${escaped})`, "gi"));
  return parts.map((part, index) =>
    part.toLowerCase() === keyword.toLowerCase() ? (
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
  const keyword = searchParams.get("keyword") || "";
  const type = searchParams.get("type") || "all";

  const [prevKeyword, setPrevKeyword] = useState(keyword);
  const [inputValue, setInputValue] = useState(keyword);
  const [data, setData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  if (keyword !== prevKeyword) {
    setPrevKeyword(keyword);
    setInputValue(keyword);
  }

  useEffect(() => {
    const controller = new AbortController();

    async function runSearch() {
      if (!keyword) {
        setData(null);
        return;
      }

      setIsLoading(true);
      setError("");

      try {
        const response = await fetch(
          `/api/search?keyword=${encodeURIComponent(keyword)}&type=${encodeURIComponent(type)}`,
          { signal: controller.signal }
        );

        const result = await response.json();

        if (!response.ok || !result.success) {
          throw new Error(result.message || "검색 중 오류가 발생했습니다.");
        }

        setData(result);
      } catch (err) {
        if (err.name !== "AbortError") {
          setError(err.message);
          setData(null);
        }
      } finally {
        setIsLoading(false);
      }
    }

    runSearch();

    return () => controller.abort();
  }, [keyword, type]);

  const handleSearchSubmit = (event) => {
    event.preventDefault();
    const trimmed = inputValue.trim();
    setSearchParams(trimmed ? { keyword: trimmed, type } : {});
  };

  const handleTypeSelect = (nextType) => {
    setSearchParams(keyword ? { keyword, type: nextType } : {});
  };

  const filterCounts = data?.filterCounts;

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
              <h3>검색대상</h3>
            </div>
            <div className="filter_divider" />
            <ul className="type_filter_list">
              {TYPE_OPTIONS.map((option) => (
                <li key={option.key}>
                  <button
                    type="button"
                    className={`type_filter_btn ${type === option.key ? "type_filter_btn_active" : ""}`}
                    onClick={() => handleTypeSelect(option.key)}
                  >
                    <span>{option.label}</span>
                    {filterCounts && (
                      <span className="filter_count_badge">
                        {filterCounts[option.key] ?? 0}
                      </span>
                    )}
                  </button>
                </li>
              ))}
            </ul>
          </aside>

          <main className="search_results">
            {!keyword ? (
              <p className="search_empty_message">검색어를 입력해주세요.</p>
            ) : (
              <>
                <div className="results_head">
                  <div className="results_count">
                    검색 결과 <strong>{data?.totalCount ?? 0}개</strong>
                  </div>
                </div>
                <div className="results_divider" />

                {isLoading && <p className="search_empty_message">검색 중입니다...</p>}
                {!isLoading && error && (
                  <p className="search_empty_message">{error}</p>
                )}
                {!isLoading && !error && data?.results.length === 0 && (
                  <p className="search_empty_message">검색 결과가 없습니다.</p>
                )}

                {!isLoading && !error && data?.results.length > 0 && (
                  <ul className="result_list">
                    {data.results.map((result) => (
                      <li className="result_item" key={result.id}>
                        <p className="result_path">
                          {result.category}
                        </p>
                        <p className="result_title">
                          <a href={result.url} target="_blank" rel="noreferrer">
                            {highlightText(result.title, keyword)}
                          </a>
                        </p>
                        <p className="result_desc">
                          {highlightText(result.content, keyword)}
                        </p>
                      </li>
                    ))}
                  </ul>
                )}
              </>
            )}
          </main>
        </div>
      </div>
      <AiChat />
      <Footer />
    </div>
  );
};

export default SearchPage;
