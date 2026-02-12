import { useDispatch, useSelector } from 'react-redux';
import { logout } from '../redux/slices/authSlice';
import { useNavigate } from 'react-router-dom';

const Home = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { user } = useSelector((state) => state.auth);

    const handleLogout = () => {
        dispatch(logout());
        navigate('/login');
    };

    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-gray-900 text-white gap-6">
            <h1 className="text-4xl font-bold">Welcome, {user?.firstName || 'Guest'} to Wallpaper App</h1>
            {user && (
                <button
                    onClick={handleLogout}
                    className="px-6 py-2 bg-red-600 hover:bg-red-700 rounded-lg font-medium transition-colors"
                >
                    Logout
                </button>
            )}
            {!user && (
                <button
                    onClick={() => navigate('/login')}
                    className="px-6 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg font-medium transition-colors"
                >
                    Login
                </button>
            )}
        </div>
    );
};

export default Home;