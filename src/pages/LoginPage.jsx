import Header from "../components/Header";
import Footer from "../components/Footer";
import "../styles/Login.css";

const LoginPage = () => {
  return (
    <div className="login_page">
      <Header />
      <main className="login_main">
        <form className="login_container">
          <h2>로그인</h2>
          <label className="login_field">
            <input type="text" placeholder="아이디" />
            <span className="login_icon login_icon_user" aria-hidden="true" />
          </label>
          <label className="login_field">
            <input type="password" placeholder="비밀번호" />
            <span className="login_icon login_icon_lock" aria-hidden="true" />
          </label>
          <button className="login_btn" type="submit">로그인 / 회원가입</button>
          <div className="login_find_links">
            <a href="#">아이디 찾기</a>
            <span>|</span>
            <a href="#">비밀번호 찾기</a>
          </div>
        </form>
      </main>
      <Footer />
    </div>
  )
}

export default LoginPage
