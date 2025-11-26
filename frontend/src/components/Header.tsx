import { useSelector, useDispatch } from 'react-redux';
import { clearUser } from '../store/slices/authSlice';
import type { RootState } from '../store/index';
import { useNavigate } from 'react-router-dom';
import Navbar from './Navbar';
import AdminLoginButton from './AdminLoginButton';
import Button from './Button';

function Header() {
  const user = useSelector((state: RootState) => state.auth.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = () => {
    dispatch(clearUser());
    navigate('/login');
  };

  return (
    <div className="flex flex-row justify-between items-center w-full px-4 bg-[#34355f] text-white">
      <Navbar />
      {user ? (
        <Button ternary rounded onClick={handleLogout}>Logout</Button>
     ) : (
        <AdminLoginButton />
      )}
    </div>
  );
}

export default Header;
