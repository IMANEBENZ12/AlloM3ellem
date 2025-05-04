import React, { useState } from 'react';
import { Facebook, Mail, Apple } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import Navbar from "./Navbar.js";
import './Login.css';

function Login() {
  const { t } = useTranslation();
  const [isSignUp, setIsSignUp] = useState(true);
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
    phoneNumber: '',
    address: '',
  });

  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const { firstName, lastName, email, password, confirmPassword, phoneNumber, address } = formData;

  const handleChange = e => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError('');
  };

  const toggleForm = () => {
    setIsSignUp(!isSignUp);
    setError('');
  };

  const handleBackToHome = () => {
    navigate('/home');
  };

  const validateForm = () => {
    if (isSignUp) {
      if (!firstName || !lastName || !email || !password || !phoneNumber) {
        setError(t('requiredFieldsError'));
        return false;
      }
      if (password !== confirmPassword) {
        setError(t('passwordMismatchError'));
        return false;
      }
      if (password.length < 6) {
        setError(t('passwordLengthError'));
        return false;
      }
    } else {
      if (!email || !password) {
        setError(t('requiredFieldsError'));
        return false;
      }
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    setLoading(true);

    try {
      const endpoint = isSignUp
        ? 'http://localhost:5000/api/auth/register'
        : 'http://localhost:5000/api/auth/login';

      const requestBody = isSignUp
        ? { firstName, lastName, email, password, phoneNumber, address, role: 'client', language: 'fr' }
        : { email, password };

      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.msg || data.errors?.[0]?.msg || t('genericError'));
      }

      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));

      navigate('/home');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSocialLogin = (provider) => {
    setError(t('socialLoginError', { provider }));
  };

  return (
    <div className="login-container">
      <div className="login-form-container">
       
        <div className="login-header">
          <h2>{isSignUp ? t('createAccount') : t('signIn')}</h2>
        </div>
        
        {error && <div className="error-message">{error}</div>}
        
        <form className="login-form" onSubmit={handleSubmit}>
          {isSignUp && (
            <>
              <div className="form-group">
                <label htmlFor="firstName" className="form-label">{t('firstName')}</label>
                <input 
                  id="firstName" 
                  name="firstName" 
                  type="text" 
                  className="form-input" 
                  placeholder={t('enterFirstName')} 
                  value={firstName}
                  onChange={handleChange}
                  required 
                />
              </div>
              
              <div className="form-group">
                <label htmlFor="lastName" className="form-label">{t('lastName')}</label>
                <input 
                  id="lastName" 
                  name="lastName" 
                  type="text" 
                  className="form-input" 
                  placeholder={t('enterLastName')} 
                  value={lastName}
                  onChange={handleChange}
                  required 
                />
              </div>
            </>
          )}
          
          <div className="form-group">
            <label htmlFor="email" className="form-label">{t('email')}</label>
            <input 
              id="email" 
              name="email" 
              type="email" 
              className="form-input" 
              placeholder={t('enterEmail')} 
              value={email}
              onChange={handleChange}
              required 
            />
          </div>
          
          {isSignUp && (
            <div className="form-group">
              <label htmlFor="phoneNumber" className="form-label">{t('phoneNumber')}</label>
              <input 
                id="phoneNumber" 
                name="phoneNumber" 
                type="tel" 
                className="form-input" 
                placeholder={t('enterPhone')} 
                value={phoneNumber}
                onChange={handleChange}
                required 
              />
            </div>
          )}
          
          {isSignUp && (
            <div className="form-group">
              <label htmlFor="address" className="form-label">{t('address')}</label>
              <input 
                id="address" 
                name="address" 
                type="text" 
                className="form-input" 
                placeholder={t('enterAddress')} 
                value={address}
                onChange={handleChange}
              />
            </div>
          )}
          
          <div className="form-group">
            <label htmlFor="password" className="form-label">{t('password')}</label>
            <input 
              id="password" 
              name="password" 
              type="password" 
              className="form-input" 
              placeholder={isSignUp ? t('createPassword') : t('enterPassword')} 
              value={password}
              onChange={handleChange}
              required 
            />
          </div>
          
          {isSignUp && (
            <div className="form-group">
              <label htmlFor="confirmPassword" className="form-label">{t('confirmPassword')}</label>
              <input 
                id="confirmPassword" 
                name="confirmPassword" 
                type="password" 
                className="form-input" 
                placeholder={t('confirmYourPassword')} 
                value={confirmPassword}
                onChange={handleChange}
                required 
              />
            </div>
          )}

          <div className="form-action">
            <button 
              type="submit" 
              className="submit-button"
              disabled={loading}
            >
              {loading ? t('loading') : (isSignUp ? t('register') : t('signInButton'))}
            </button>
          </div>
          
          <div className="divider">
            <span>{t('orContinueWith')}</span>
          </div>

          <div className="social-login">
            <button 
              type="button" 
              className="social-button"
              onClick={() => handleSocialLogin('Facebook')}
            >
              <Facebook className="social-icon facebook" />
            </button>
            <button 
              type="button" 
              className="social-button"
              onClick={() => handleSocialLogin('Google')}
            >
              <Mail className="social-icon google" />
            </button>
            <button 
              type="button" 
              className="social-button"
              onClick={() => handleSocialLogin('Apple')}
            >
              <Apple className="social-icon apple" />
            </button>
          </div>
          
          <div className="form-toggle">
            <p>
              {isSignUp ? t('alreadyHaveAccount') : t('noAccount')}
              <button 
                type="button"
                onClick={toggleForm}
                className="toggle-button"
              >
                {isSignUp ? t('signInButton') : t('register')}
              </button>
            </p>
          </div>
          
          <div className="home-link">
            <button 
              type="button"
              onClick={handleBackToHome}
              className="back-button"
            >
              {t('backToHome')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default Login;