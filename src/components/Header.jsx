import "../styles/Header.css";
import logo from "../assets/images/logo.png";
const Header = () => {
  return (
    <div className="header_body">
      <img src={logo} alt="로고 이미지" />
    </div>
  )
}

export default Header