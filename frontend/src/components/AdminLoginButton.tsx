import { useNavigate } from "react-router-dom";

function AdminLoginButton() {
    const navigate = useNavigate();

    const handleClick = () => {
        navigate("/login")
    }

    return (
              <p onClick={handleClick} className="ml-auto mr-10 cursor-pointer hover:font-bold">Admin</p>
    );
}

export default AdminLoginButton;