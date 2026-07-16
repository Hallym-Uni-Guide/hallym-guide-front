import Header from "../components/Header";
import NoticeCard from "../components/NoticeCard";
import Footer from "../components/Footer";
import MajorSelect from "../components/MajorSelect";
import AiChat from "../components/AiChat";
import "../styles/HomePage.css";

const HomePage = () => {
  return (
    <div>
      <Header />
      <div className="home_body">
        <div className="home_body_left">
          <input className="search_var " type="search" placeholder="검색어 입력" />
          <div className="school_life">
            <h2>학교 생활</h2>
            <table className="school_life_menu">
              <tbody>
                <tr>
                  <td><button>전공</button></td>
                  <td><button>신입생 가이드</button></td>
                  <td><button>수강신청</button></td>
                </tr>
                <tr>
                  <td><button>휴·복학</button></td>
                  <td><button>학생증</button></td>
                  <td><button>졸업</button></td>
                </tr>
              </tbody>
            </table>
          </div>
          <div className="body_left_bottom">
            <div className="campus_map_containor">
              <h2>캠퍼스 맵</h2>
              <div className="campus_map">캠퍼스 맵</div>
            </div>
            <div className="schedule_calendar">
              <div className="schedule_head">
                <h2>2026학년도 학사일정</h2>
                <div className="schedule_more_link">자세히 보기</div>
              </div>
            </div>
          </div>
        </div>
        <div className="home_body_right">
          <div className="profile">
            <h3>학적정보를 입력하고 맞춤형 정보를 <div/>편리하게 이용하세요.</h3>
            <table>
              <tbody>
                <tr>
                  <th className="profile_option_name">전공 선택</th>
                  <td>
                    <MajorSelect />
                  </td>
                </tr>
                <tr>
                  <th>학년 선택</th>
                  <td>
                    <select className="profile_select">
                      <option value="" disabled />
                      <option>1학년</option>
                      <option>2학년</option>
                      <option>3학년</option>
                      <option>4학년</option>
                    </select>
                  </td>
                </tr>
                <tr>
                  <th>학적 선택</th>
                  <td>
                    <select className="profile_select" name="academicStatus" defaultValue="">
                      <option value="" disabled />
                      <option value="재학">재학</option>
                      <option value="휴학">휴학</option>
                      <option value="졸업유예">졸업유예</option>
                      <option value="졸업">졸업</option>
                      <option value="신입학예정">신입학 예정</option>
                    </select>
                  </td>
                </tr>
              </tbody>
            </table>
            <button className="login_or_signup_btn">로그인 / 회원가입</button>
          </div>
          <div className="notice_section">
            <NoticeCard />
          </div>
        </div>
      </div>
      <AiChat/>
      <Footer />
    </div>
  );
};

export default HomePage;
