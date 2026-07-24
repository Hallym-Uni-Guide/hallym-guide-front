import { useState } from "react";
import "../styles/AiChat.css";
import Union from "../assets/images/Union.png";

const AiChat = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      {isOpen && (
        <div className="aichat_panel">
          <h3 className="aichat_panel_title">
            궁금한 학교정보를
            <br />
            간편하게 확인해보세요!
          </h3>
          <p className="aichat_panel_subtitle">
            학사, 수업, 장학, 캠퍼스 정보까지
            <br />
            원하는 정보를 쉽고 빠르게 얻을 수 있어요.
          </p>
          <div className="aichat_panel_options">
            <button
              type="button"
              className="aichat_option_btn"
              onClick={() => setIsOpen(false)}
            >
              <span className="icon icon_monitor" aria-hidden="true" />
              <span className="aichat_option_label">챗봇에게 물어보기</span>
              <span className="aichat_option_arrow">
                <span className="icon icon_arrow_right" aria-hidden="true" />
              </span>
            </button>
            <button
              type="button"
              className="aichat_option_btn"
              onClick={() => setIsOpen(false)}
            >
              <span className="icon icon_list" aria-hidden="true" />
              <span className="aichat_option_label">자주 묻는 질문</span>
              <span className="aichat_option_arrow">
                <span className="icon icon_arrow_right" aria-hidden="true" />
              </span>
            </button>
          </div>
          <button
            type="button"
            className="aichat_panel_toggle"
            onClick={() => setIsOpen(false)}
            aria-label="챗봇 닫기"
          >
            <img src={Union} alt="챗봇 캐릭터 이미지" />
          </button>
        </div>
      )}
      {!isOpen && (
        <button
          type="button"
          className="aichat_btn"
          onClick={() => setIsOpen(true)}
          aria-label="챗봇 열기"
          aria-expanded={isOpen}
        >
          <img src={Union} alt="챗봇 캐릭터 이미지" />
        </button>
      )}
    </>
  );
};

export default AiChat;
