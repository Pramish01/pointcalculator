import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import '../styles/LoginSlide.css';

const Login = () => {
  const [isSignup, setIsSignup] = useState(false);
  const [loginData, setLoginData] = useState({ email: '', password: '' });
  const [signupData, setSignupData] = useState({ username: '', email: '', password: '' });
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const navigate = useNavigate();
  const { login, register } = useAuth();
  const containerRef = useRef(null);
  const cursorRef = useRef(null);
  const cursorDotRef = useRef(null);

  // Custom cursor effect
  useEffect(() => {
    let mouseX = 0, mouseY = 0;
    let cursorX = 0, cursorY = 0;

    const handleMouseMove = (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;

      if (cursorDotRef.current) {
        cursorDotRef.current.style.left = mouseX + 'px';
        cursorDotRef.current.style.top = mouseY + 'px';
      }
    };

    const animateCursor = () => {
      cursorX += (mouseX - cursorX) * 0.15;
      cursorY += (mouseY - cursorY) * 0.15;

      if (cursorRef.current) {
        cursorRef.current.style.left = cursorX + 'px';
        cursorRef.current.style.top = cursorY + 'px';
      }

      requestAnimationFrame(animateCursor);
    };

    document.addEventListener('mousemove', handleMouseMove);
    animateCursor();

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setError('');

    try {
      await login(loginData.email, loginData.password);
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed');
    }
  };

  const handleSignupSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccessMessage('');

    try {
      const response = await register(signupData.username, signupData.email, signupData.password);
      if (response?.status === 'pending') {
        setSuccessMessage('Registration successful! Your account is pending admin approval. You will be able to login once approved.');
        setIsSignup(false);
        setSignupData({ username: '', email: '', password: '' });
      } else {
        navigate('/');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Signup failed');
    }
  };

  const toggleForm = (signup) => {
    setIsSignup(signup);
    setError('');
    setSuccessMessage('');
  };

  const handleMouseEnter = (e) => {
    if (cursorRef.current) {
      cursorRef.current.classList.add('hover');
    }
  };

  const handleMouseLeave = (e) => {
    if (cursorRef.current) {
      cursorRef.current.classList.remove('hover');
    }
  };

  return (
    <div className="login-page">
      {/* Custom Cursor Elements */}
      <div ref={cursorRef} className="custom-cursor"></div>
      <div ref={cursorDotRef} className="custom-cursor-dot"></div>

      <div ref={containerRef} className={`container ${isSignup ? 'active' : ''}`}>
        <div className="curved-shape"></div>
        <div className="curved-shape2"></div>

        {/* Login Form */}
        <div className="form-box Login">
          <h2 className="animation" style={{'--D': 0, '--S': 21}}>Login</h2>
          {error && !isSignup && <div className="error-message animation" style={{'--D': 1, '--S': 22}}>{error}</div>}
          {successMessage && !isSignup && <div className="success-message animation" style={{'--D': 1, '--S': 22}}>{successMessage}</div>}
          <form onSubmit={handleLoginSubmit}>
            <div className="input-box animation" style={{'--D': 1, '--S': 22}}>
              <input
                type="email"
                value={loginData.email}
                onChange={(e) => setLoginData({...loginData, email: e.target.value})}
                onMouseEnter={handleMouseEnter}
                onMouseLeave={handleMouseLeave}
                required
              />
              <label>Email</label>
              <i className="fa-solid fa-envelope"></i>
            </div>

            <div className="input-box animation" style={{'--D': 2, '--S': 23}}>
              <input
                type="password"
                value={loginData.password}
                onChange={(e) => setLoginData({...loginData, password: e.target.value})}
                onMouseEnter={handleMouseEnter}
                onMouseLeave={handleMouseLeave}
                required
              />
              <label>Password</label>
              <i className="fa-solid fa-lock"></i>
            </div>

            <div className="input-box animation" style={{'--D': 3, '--S': 24}}>
              <button
                className="btn"
                type="submit"
                onMouseEnter={handleMouseEnter}
                onMouseLeave={handleMouseLeave}
              >
                Login
              </button>
            </div>

            <div className="regi-link animation" style={{'--D': 4, '--S': 25}}>
              <p>
                Don't have an account? {' '}
                <a
                  href="#"
                  onClick={(e) => { e.preventDefault(); toggleForm(true); }}
                  onMouseEnter={handleMouseEnter}
                  onMouseLeave={handleMouseLeave}
                >
                  Sign Up
                </a>
              </p>
            </div>
          </form>
        </div>

        {/* Login Info Content */}
        <div className="info-content Login">
          <h2 className="animation" style={{'--D': 0, '--S': 20}}>WELCOME BACK!</h2>
          <p className="animation" style={{'--D': 1, '--S': 21}}>
            Sign in to access your event management dashboard and track your team's progress.
          </p>
        </div>

        {/* Signup Form */}
        <div className="form-box Signup">
          <h2 className="animation" style={{'--li': 17, '--S': 0}}>Sign Up</h2>
          {error && isSignup && <div className="error-message animation" style={{'--li': 18, '--S': 1}}>{error}</div>}
          <form onSubmit={handleSignupSubmit}>
            <div className="input-box animation" style={{'--li': 18, '--S': 1}}>
              <input
                type="text"
                value={signupData.username}
                onChange={(e) => setSignupData({...signupData, username: e.target.value})}
                onMouseEnter={handleMouseEnter}
                onMouseLeave={handleMouseLeave}
                required
              />
              <label>Username</label>
              <i className="fa-solid fa-user"></i>
            </div>

            <div className="input-box animation" style={{'--li': 19, '--S': 1}}>
              <input
                type="email"
                value={signupData.email}
                onChange={(e) => setSignupData({...signupData, email: e.target.value})}
                onMouseEnter={handleMouseEnter}
                onMouseLeave={handleMouseLeave}
                required
              />
              <label>Email</label>
              <i className="fa-solid fa-envelope"></i>
            </div>

            <div className="input-box animation" style={{'--li': 20, '--S': 2}}>
              <input
                type="password"
                value={signupData.password}
                onChange={(e) => setSignupData({...signupData, password: e.target.value})}
                onMouseEnter={handleMouseEnter}
                onMouseLeave={handleMouseLeave}
                required
              />
              <label>Password</label>
              <i className="fa-solid fa-lock"></i>
            </div>

            <div className="input-box animation" style={{'--li': 21, '--S': 3}}>
              <button
                className="btn"
                type="submit"
                onMouseEnter={handleMouseEnter}
                onMouseLeave={handleMouseLeave}
              >
                Sign Up
              </button>
            </div>

            <div className="regi-link animation" style={{'--li': 22, '--S': 4}}>
              <p>
                Already have an account? {' '}
                <a
                  href="#"
                  onClick={(e) => { e.preventDefault(); toggleForm(false); }}
                  onMouseEnter={handleMouseEnter}
                  onMouseLeave={handleMouseLeave}
                >
                  Sign In
                </a>
              </p>
            </div>
          </form>
        </div>

        {/* Signup Info Content */}
        <div className="info-content Signup">
          <h2 className="animation" style={{'--li': 17, '--S': 0}}>Join with Us!</h2>
          <p className="animation" style={{'--li': 18, '--S': 1}}>
            Create an account to start managing events and collaborating with your team.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
