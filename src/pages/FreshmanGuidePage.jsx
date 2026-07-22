import { useState } from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import AiChat from "../components/AiChat";
import "../styles/FreshmanGuidePage.css";

const KEYWORDS = [
  "키워드 탭",
  "키워드 탭",
  "키워드 탭",
  "키워드 탭",
  "키워드 탭",
  "키워드 탭",
  "키워드 탭",
  "키워드 탭",
  "키워드 탭",
  "키워드 탭",
];

const TAGS = ["#태그", "#태그", "#태그", "#태그", "#태그", "#태그", "#태그", "#태그", "#태그"];

const CARDS = Array.from({ length: 6 }, (_, index) => ({
  id: index + 1,
  title: "제목입력",
  desc: "설명",
  tags: TAGS,
}));

const FreshmanGuidePage = () => {
  const [keyword, setKeyword] = useState("");
  const [activeKeywords, setActiveKeywords] = useState(
    new Set(KEYWORDS.map((_, index) => index).filter((index) => index < 7))
  );

  const toggleKeyword = (index) => {
    setActiveKeywords((prev) => {
      const next = new Set(prev);
      if (next.has(index)) {
        next.delete(index);
      } else {
        next.add(index);
      }
      return next;
    });
  };

  return (
    <div className="guide_page">
      <Header />
      <div className="guide_title_wrap">
        <h1 className="guide_title">신입생 가이드</h1>
      </div>
      <div className="guide_body">
        <form className="guide_search_bar" onSubmit={(event) => event.preventDefault()}>
          <input
            className="guide_search_input"
            type="search"
            placeholder="검색어 입력"
            value={keyword}
            onChange={(event) => setKeyword(event.target.value)}
          />
          <button className="guide_search_btn" type="submit" aria-label="검색">
            <span className="icon icon_search" aria-hidden="true" />
          </button>
        </form>

        <div className="keyword_tabs">
          {KEYWORDS.map((label, index) => (
            <button
              key={index}
              className={`keyword_tab ${activeKeywords.has(index) ? "keyword_tab_active" : ""}`}
              type="button"
              onClick={() => toggleKeyword(index)}
            >
              {label}
            </button>
          ))}
        </div>

        <div className="guide_grid">
          {CARDS.map((card) => (
            <div className="guide_card" key={card.id}>
              <div className="guide_card_head">
                <h3 className="guide_card_title">
                  {card.title}
                  <span className="icon icon_chevron_right_sm" aria-hidden="true" />
                </h3>
                <button className="bookmark_btn" type="button" aria-label="북마크">
                  <span className="icon icon_bookmark" aria-hidden="true" />
                </button>
              </div>
              <p className="guide_card_desc">{card.desc}</p>
              <div className="guide_card_tags">
                {card.tags.map((tag, index) => (
                  <span className="tag_pill" key={index}>
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
      <AiChat />
      <Footer />
    </div>
  );
};

export default FreshmanGuidePage;
