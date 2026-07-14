import Header from "../components/Header"
import "../styles/HomePage.css";

const HomePage = () => {
  return (
    <div>
        <Header/>
        <div className="home_body">
            <div className="home_body_left">
                <input className="search_var " type="search" placeholder="안녕하세요, 무엇을 알고 싶으세요?"/>
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
                            <tr>
                                <td><button>국제교류</button></td>
                                <td><button>증명서</button></td>
                                <td><button>기숙사</button></td>
                            </tr>
                        </tbody>
                    </table>
                    
                </div>
                <div className="body_left_bottom">
                    <div className="campus_map_containor">캠퍼스 맵</div>
                    <div className="chedule_calendar">일정 달력</div>
                </div>
            </div>
            <div className="home_body_right">
                <div className="profile">프로필</div>
                <div className="notice_section">공지</div>
            </div>
        </div>
    </div>
  )
}

export default HomePage