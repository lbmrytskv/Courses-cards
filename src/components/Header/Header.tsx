import React from "react";
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import Button from "../../common/Button/Button";
import Logo from "./components/Logo/Logo";
import { logout } from "../../store/user/reducer";
import { AppState } from "../../store/types";

function Header() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { isAuth, name } = useSelector((state: AppState) => state.user);

  const handleButtonClick = () => {
    if (isAuth) {
      localStorage.removeItem("authToken");
      dispatch(logout()); 
      navigate("/login");
    } else {
      navigate("/login");
    }
  };

  return (
    <header className="header">
      <Logo />
      {isAuth && <span>Welcome, {name}!</span>}
      <Button
        buttonText={isAuth ? "Logout" : "Login"}
        onClick={handleButtonClick}
      />
    </header>
  );
}

export default Header;