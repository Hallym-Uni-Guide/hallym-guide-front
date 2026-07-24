import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Header from "../components/Header";
import Footer from "../components/Footer";
import "../styles/Login.css";

const LoginPage = () => {
  const navigate = useNavigate();

  const [id, setId] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");
    setIsSubmitting(true);

    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ id, password }),
      });

      const result = await response.json();

      if (!response.ok || !result.success) {
        setError(result.message || "로그인에 실패했습니다.");
        return;
      }

      navigate("/");
    } catch {
      setError("서버와 통신하지 못했습니다.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="login_page">
      <Header />
      <main className="login_main">
        <form className="login_container" onSubmit={handleSubmit}>
          <h2>로그인</h2>
          <label className="login_field">
            <input
              type="text"
              placeholder="아이디"
              value={id}
              onChange={(event) => setId(event.target.value)}
            />
            <span className="login_icon login_icon_user" aria-hidden="true" />
          </label>
          <label className="login_field">
            <input
              type="password"
              placeholder="비밀번호"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
            />
            <span className="login_icon login_icon_lock" aria-hidden="true" />
          </label>

          {error && <p className="login_error">{error}</p>}

          <button className="login_btn" type="submit" disabled={isSubmitting}>
            로그인
          </button>
          <div className="login_find_links">
            <a href="#">아이디 찾기</a>
            <span>|</span>
            <a href="#">비밀번호 찾기</a>
            <span>|</span>
            <Link to="/signup">회원가입</Link>
          </div>
        </form>
      </main>
      <Footer />
    </div>
  );
};

export default LoginPage;
