import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { majors } from "../data/majors";
import "../styles/Login.css";

const SignupPage = () => {
  const navigate = useNavigate();

  const [id, setId] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [major, setMajor] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");

    if (!id || !password || !name || !major) {
      setError("모든 항목을 입력해주세요.");
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, password, name, major }),
      });

      const result = await response.json();

      if (!response.ok || !result.success) {
        setError(result.message || "회원가입에 실패했습니다.");
        return;
      }

      navigate("/login");
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
          <h2>회원가입</h2>
          <label className="login_field">
            <input
              type="text"
              placeholder="아이디"
              value={id}
              onChange={(event) => setId(event.target.value)}
            />
          </label>
          <label className="login_field">
            <input
              type="password"
              placeholder="비밀번호"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
            />
          </label>
          <label className="login_field">
            <input
              type="text"
              placeholder="이름"
              value={name}
              onChange={(event) => setName(event.target.value)}
            />
          </label>
          <label className="login_field">
            <select
              className="login_select"
              value={major}
              onChange={(event) => setMajor(event.target.value)}
            >
              <option value="" disabled>
                학과 선택
              </option>
              {majors.map((majorName) => (
                <option key={majorName} value={majorName}>
                  {majorName}
                </option>
              ))}
            </select>
          </label>

          {error && <p className="login_error">{error}</p>}

          <button className="login_btn" type="submit" disabled={isSubmitting}>
            회원가입
          </button>
        </form>
      </main>
      <Footer />
    </div>
  );
};

export default SignupPage;
