import Header from "../components/Header";
import Footer from "../components/Footer";
import AiChat from "../components/AiChat";
import "../styles/CourseRegistrationPage.css";

const CourseRegistrationPage = () => {
  return (
    <div className="course_page">
      <Header />
      <div className="course_page_title_wrap">
        <h1 className="course_page_title">수강신청</h1>
      </div>
      <div className="course_page_body">
        <div className="course_grid">
          <div className="course_left">
            <section className="card">
              <h3 className="card_title">
                수강신청 하러가기
                <span className="icon icon_paperclip" aria-hidden="true" />
              </h3>
              <div className="store_badges">
                <a
                  className="store_badge"
                  href="https://www.apple.com/app-store/"
                  target="_blank"
                  rel="noreferrer"
                >
                  <span className="icon icon_apple" aria-hidden="true" />
                  <span className="store_badge_text">
                    <span className="store_badge_small">Download on the</span>
                    <span className="store_badge_large">App Store</span>
                  </span>
                </a>
                <a
                  className="store_badge"
                  href="https://play.google.com/store"
                  target="_blank"
                  rel="noreferrer"
                >
                  <span className="icon icon_play" aria-hidden="true" />
                  <span className="store_badge_text">
                    <span className="store_badge_small">GET IT ON</span>
                    <span className="store_badge_large">Google Play</span>
                  </span>
                </a>
              </div>
            </section>

            <section className="card">
              <h3 className="card_title">
                수강신청 일정
                <span className="icon icon_calendar" aria-hidden="true" />
              </h3>
              <h4 className="section_heading">시기와 절차</h4>
              <ul className="bullet_list">
                <li>매 학기 수강신청은 개강 전에 실시</li>
                <li>오전 10시~오후 5시에 진행</li>
              </ul>
              <h4 className="section_heading">날짜</h4>
              <ul className="bullet_list">
                <li>1일차 - 4학년</li>
                <li>2일차 - 3학년</li>
                <li>3일차 - 2학년</li>
                <li>4일차 - 1학년</li>
                <li>전체수강날짜는 학사일정 참조</li>
              </ul>
            </section>

            <section className="card">
              <h3 className="card_title">
                수강신청 변경/철회
                <span className="icon icon_refresh_lg" aria-hidden="true" />
              </h3>
              <h4 className="section_heading">수강 변경</h4>
              <ul className="bullet_list">
                <li>개강 후 첫 번째 주에 자유롭게 신청/철회</li>
              </ul>
              <h4 className="section_heading">수강 철회</h4>
              <ul className="bullet_list">
                <li>수업주수의 1/4 이전까지 수강신청 사이트/어플에서 철회</li>
                <li>최대 2과목 철회 가능</li>
                <li>철회 후 수강인원이 폐강이 되는 인원이 되었을 때 수강철회 불가능</li>
                <li>학기당 최저 수강학점을 지키는 선에서 철회 가능</li>
                <li>철회한 과목은 그 학기에 다시 들을 수 없음</li>
              </ul>
            </section>
          </div>

          <div className="course_right">
            <section className="card">
              <h3 className="card_title">
                수강신청 하는 방법
                <span className="icon icon_clipboard" aria-hidden="true" />
              </h3>
              <div className="method_columns">
                <div className="method_column">
                  <h4 className="section_heading section_heading_first">웹사이트</h4>
                  <ol className="number_list">
                    <li>한림대학교 수강신청 사이트에 로그인한다.</li>
                    <li>조회 메뉴에서 개설 강좌와 시간표를 확인한다.</li>
                    <li>수강신청날 원하는 교과목을 신청한다.</li>
                    <li>장바구니가 있으면 장바구니에 들어가 신청한다.</li>
                  </ol>
                  <h4 className="section_heading">유의사항</h4>
                  <ul className="bullet_list">
                    <li>매크로 프로그램 사용방지 대책이 있다.</li>
                    <li>
                      멀티로그인 금지
                      <ul className="bullet_list bullet_list_sub">
                        <li>동일한 학번으로 동시에 두 군데 이상 이용시 한 곳을 제외하고 나머지는 로그아웃</li>
                        <li>모바일도 포함이다.</li>
                      </ul>
                    </li>
                    <li>팝업차단 해제</li>
                    <li>크롬, 파이어폭스 브라우저를 사용하기</li>
                  </ul>
                </div>
                <div className="method_column">
                  <h4 className="section_heading section_heading_first">어플</h4>
                  <ol className="number_list">
                    <li>한림대학교 수강신청 어플에 로그인 한다.</li>
                    <li>조회 메뉴에서 강좌와 시간표를 확인한다.</li>
                    <li>수강신청날 원하는 교과목을 검색하여 신청한다.</li>
                    <li>장바구니가 있으면 장바구니에 들어가 신청한다.</li>
                  </ol>
                  <h4 className="section_heading">유의사항</h4>
                  <ul className="bullet_list">
                    <li>매크로 프로그램 사용방지 대책이 있다.</li>
                    <li>
                      멀티로그인 금지
                      <ul className="bullet_list bullet_list_sub">
                        <li>동일한 학번으로 동시에 두 군데 이상 이용시 한 곳을 제외하고 나머지는 로그아웃</li>
                        <li>모바일도 포함이다.</li>
                      </ul>
                    </li>
                    <li>로그인 후 일정시간이 지나면 자동으로 로그아웃된다.</li>
                    <li>대체재이수 신청은 어플에서 할 수 없다.</li>
                  </ul>
                </div>
              </div>
            </section>

            <div className="course_right_bottom">
              <section className="card">
                <h3 className="card_title">
                  장바구니
                  <span className="icon icon_cart" aria-hidden="true" />
                </h3>
                <h4 className="section_heading section_heading_first">수강신청 장바구니란?</h4>
                <ul className="bullet_list">
                  <li>수강신청을 할 때 빠르게 신청할 수 있도록 장바구니에 강의를 미리 담아 한 번에 수강신청 할 수 있는 기능</li>
                  <li>담은 인원이 수강인원보다 같거나 적으면 수강신청날 자동으로 신청된다</li>
                  <li>담원 인원이 수강인원보다 많으면, 수강신청날 직접 신청해야한다.</li>
                </ul>
                <h4 className="section_heading">장바구니 사용하는 방법</h4>
                <ul className="bullet_list">
                  <li>원하는 강의를 찾고, 장바구니에 담기를 누르면 담긴다.</li>
                  <li>장바구니 조회에서 내가 담은 강의와 몇명이나 신청했는지 확인이 가능하고, 담은 강의를 삭제할 수 있다.</li>
                </ul>
                <h4 className="section_heading">유의사항</h4>
                <ul className="bullet_list">
                  <li>신입생은 1학기에 장바구니를 사용할 수 없다 2학기부터 사용이 가능하다</li>
                  <li>계절학기엔 장바구니를 이용할 수 없다.</li>
                </ul>
              </section>

              <section className="card">
                <h3 className="card_title">
                  수강신청 팁
                  <span className="icon icon_lightbulb" aria-hidden="true" />
                </h3>
                <h4 className="section_heading section_heading_first">장바구니 활용하기</h4>
                <ul className="bullet_list">
                  <li>수강신청 탭에서 장바구니로 이동하여 담겨있는 과목 옆에 있는 수강신청을 누르면 빠르게 수강신청을 할 수 있다.</li>
                </ul>
                <h4 className="section_heading">강의계획서 꼭 확인하기</h4>
                <ul className="bullet_list">
                  <li>모든 강의는 강의 계획서를 따른다. 강의명만 보고 수강신청을한다면 예상치 못한 내용의 강의를 들을 수 있기 때문에 강의 계획서는 꼭 확인해야 한다.</li>
                </ul>
                <h4 className="section_heading">검색할 때</h4>
                <ul className="bullet_list">
                  <li>웹에서는 (과목,교수명,학과명)을 자유롭게 적어 검색할 수 있다.</li>
                  <li>모바일에선 Course 탭에서 검색이 가능하며 과목명만 검색이 가능하다.</li>
                </ul>
              </section>
            </div>
          </div>
        </div>
      </div>
      <AiChat />
      <Footer />
    </div>
  );
};

export default CourseRegistrationPage;
