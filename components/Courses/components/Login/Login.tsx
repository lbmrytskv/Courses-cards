import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { loginSuccess } from '../../../../store/user/reducer';
import Input from '../../../../common/Input/Input';
import Button from '../../../../common/Button/Button';

interface FormData {
  email: string;
  password: string;
}

interface Errors {
  email?: string;
  password?: string;
}

export default function Login() {
  const [formData, setFormData] = useState<FormData>({ email: '', password: '' });
  const [errors, setErrors] = useState<Errors>({});
  const [serverError, setServerError] = useState('');
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const validate = () => {
    const newErrors: Errors = {};
    if (!formData.email) newErrors.email = 'The "Email" field is required.';
    if (!formData.password) newErrors.password = 'The "Password" field is required.';
    return newErrors;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }
  
    setErrors({});
    setServerError('');
  
    try {
      const response = await fetch('http://localhost:4000/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
  
      if (response.ok) {
        const data = await response.json();
        console.log('Login successful, user:', data.user); 
  
        localStorage.setItem('token', data.result);
        localStorage.setItem('email', data.user.email);
  
      
        const isAdmin = data.user.email === 'admin@email.com';
  
        dispatch(
          loginSuccess({
            name: data.user.name,
            email: data.user.email,
            token: data.result,
            isAdmin, 
          })
        );
  
        localStorage.setItem('isAdmin', JSON.stringify(isAdmin));
  
        navigate('/courses', { replace: true });
      } else {
        setServerError('Invalid credentials');
      }
    } catch (error) {
      console.error('Network error:', error);
      setServerError('Network error. Please try again.');
    }
  };
  
  

  return (
    <div className="login-container">
      <form className="login-form" onSubmit={handleSubmit} noValidate>
        <h2 className="form-title">Login</h2>
        <div className="form-group">
          <Input
            labelText="Email"
            placeholderText="Enter your email"
            type="email"
            value={formData.email}
            onChange={handleInputChange}
            name="email"
          />
          {errors.email && <p className="error">{errors.email}</p>}
        </div>
        <div className="form-group">
          <Input
            labelText="Password"
            placeholderText="Enter your password"
            type="password"
            value={formData.password}
            onChange={handleInputChange}
            name="password"
          />
          {errors.password && <p className="error">{errors.password}</p>}
        </div>
        <Button buttonText="Login" className="submit-button" />
        {serverError && <p className="server-error">{serverError}</p>}
        <p className="form-footer">
          Don't have an account? <a href="/registration">Register</a>
        </p>
      </form>
    </div>
  );
}