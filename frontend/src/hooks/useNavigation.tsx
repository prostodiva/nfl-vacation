import { useNavigate } from "react-router-dom";

function useNavigation() {
  const navigate = useNavigate();
  const currentPath = window.location.pathname;

  return {
    navigate,
    currentPath,
  };
}

export default useNavigation;