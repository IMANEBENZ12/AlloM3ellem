import React, { useState } from 'react';
import { Facebook, Mail, Apple } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import './Login.css';

function Login() {
  const [isSignUp, setIsSignUp] = useState(true);
  const navigate = useNavigate();

  // Form states
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
    phoneNumber: '',
    address: '',
    role: 'client', // Default role
    language: 'fr'  // Default language
  });

  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const { firstName, lastName, email, password, confirmPassword, phoneNumber, address } = formData;

  const handleChange = e => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError(''); // Clear errors when user changes input
  };

  const toggleForm = () => {
    setIsSignUp(!isSignUp);
    setError(''); // Clear errors when switching forms
  };

  const handleBackToHome = () => {
    navigate('/home');
  };

  const validateForm = () => {
    if (isSignUp) {
      if (!firstName || !lastName || !email || !password || !phoneNumber) {
        setError('Veuillez remplir tous les champs obligatoires');
        return false;
      }
      if (password !== confirmPassword) {
        setError('Les mots de passe ne correspondent pas');
        return false;
      }
      if (password.length < 6) {
        setError('Le mot de passe doit contenir au moins 6 caractères');
        return false;
      }
    } else {
      if (!email || !password) {
        setError('Veuillez remplir tous les champs obligatoires');
        return false;
      }
    }
    return true;
  };

  const handleSubmit = async e => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setLoading(true);
    
    try {
      const endpoint = isSignUp ? '/api/auth/register' : '/api/auth/login';
      
      const requestBody = isSignUp 
        ? { firstName, lastName, email, password, phoneNumber, address, role: 'client', language: 'fr' }
        : { email, password };
      
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(requestBody)
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.msg || data.errors[0].msg || 'Une erreur est survenue');
      }
      
      // Save token and user data in localStorage
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));
      
      // Redirect to home page or dashboard
      navigate('/');
      
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSocialLogin = (provider) => {
    // This would be implemented based on your social login strategy
    console.log(`Login with ${provider}`);
    // For now we'll just show a placeholder message
    setError(`Social login with ${provider} not implemented yet`);
  };

  return (
    <div className="login-container">
      <div className="login-form-container">
        <div className="login-header">
          <h2>{isSignUp ? "Créer un compte" : "Se connecter"}</h2>
        </div>
        
        {error && <div className="error-message">{error}</div>}
        
        <form className="login-form" onSubmit={handleSubmit}>
          {isSignUp && (
            <>
              <div className="form-group">
                <label htmlFor="firstName" className="form-label">Prénom</label>
                <input 
                  id="firstName" 
                  name="firstName" 
                  type="text" 
                  className="form-input" 
                  placeholder="Entrez votre prénom" 
                  value={firstName}
                  onChange={handleChange}
                  required 
                />
              </div>
              
              <div className="form-group">
                <label htmlFor="lastName" className="form-label">Nom</label>
                <input 
                  id="lastName" 
                  name="lastName" 
                  type="text" 
                  className="form-input" 
                  placeholder="Entrez votre nom" 
                  value={lastName}
                  onChange={handleChange}
                  required 
                />
              </div>
            </>
          )}
          
          <div className="form-group">
            <label htmlFor="email" className="form-label">Email</label>
            <input 
              id="email" 
              name="email" 
              type="email" 
              className="form-input" 
              placeholder="Entrez votre email" 
              value={email}
              onChange={handleChange}
              required 
            />
          </div>
          
          {isSignUp && (
            <div className="form-group">
              <label htmlFor="phoneNumber" className="form-label">Numéro de téléphone</label>
              <input 
                id="phoneNumber" 
                name="phoneNumber" 
                type="tel" 
                className="form-input" 
                placeholder="Entrez votre numéro de téléphone" 
                value={phoneNumber}
                onChange={handleChange}
                required 
              />
            </div>
          )}
          
          {isSignUp && (
            <div className="form-group">
              <label htmlFor="address" className="form-label">Adresse (optionnel)</label>
              <input 
                id="address" 
                name="address" 
                type="text" 
                className="form-input" 
                placeholder="Entrez votre adresse" 
                value={address}
                onChange={handleChange}
              />
            </div>
          )}
          
          <div className="form-group">
            <label htmlFor="password" className="form-label">Mot de passe</label>
            <input 
              id="password" 
              name="password" 
              type="password" 
              className="form-input" 
              placeholder={isSignUp ? "Créez un mot de passe" : "Entrez votre mot de passe"} 
              value={password}
              onChange={handleChange}
              required 
            />
          </div>
          
          {isSignUp && (
            <div className="form-group">
              <label htmlFor="confirmPassword" className="form-label">Confirmer le mot de passe</label>
              <input 
                id="confirmPassword" 
                name="confirmPassword" 
                type="password" 
                className="form-input" 
                placeholder="Confirmez votre mot de passe" 
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
              {loading ? "Chargement..." : (isSignUp ? "S'inscrire" : "Se connecter")}
            </button>
          </div>
          
          <div className="divider">
            <span>Ou continuer avec</span>
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
              {isSignUp ? "Vous avez déjà un compte ?" : "Vous n'avez pas de compte ?"}
              <button 
                type="button"
                onClick={toggleForm}
                className="toggle-button"
              >
                {isSignUp ? "Se connecter" : "S'inscrire"}
              </button>
            </p>
          </div>
          
          <div className="home-link">
            <button 
              type="button"
              onClick={handleBackToHome}
              className="back-button"
            >
              Retour à l'accueil
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default Login;