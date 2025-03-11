import React, { useState } from "react";
import { Link } from "react-router-dom";  // Додано Link
import Input from "../../../../common/Input/Input";
import Button from "../../../../common/Button/Button";

interface FormData {
  name: string;
  email: string;
  password: string;
}

interface Errors {
  name?: string;
  email?: string;
  password?: string;
}

function Registration() {
  const [formData, setFormData] = useState<FormData>({
    name: '',
    email: '',
    password: '',
  });

  const [errors, setErrors] = useState<Errors>({});
  const [serverError, setServerError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const validate = (): Errors => {
    const newErrors: Errors = {};
    if (!formData.name.trim()) newErrors.name = 'The "Name" field is required.';
    if (!formData.email.trim()) newErrors.email = 'The "Email" field is required.';
    if (!formData.password.trim()) newErrors.password = 'The "Password" field is required.';
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
    setSuccessMessage('');

    try {
      const response = await fetch('https://backend-course-cards.onrender.com/register', {  
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        setSuccessMessage('Registration successful! Please log in.');
        setFormData({ name: '', email: '', password: '' });
      } else {
        const errorData = await response.json();
        setServerError(errorData.message || 'Registration failed.');
      }
    } catch (err) {
      setServerError('Network error. Please try again.');
    }
  };

  return (
    <div className="registration-container">
      <form className="registration-form" onSubmit={handleSubmit}>
        <h2 className="form-title">Registration</h2>

        <div className="form-group">
          <Input
            labelText="Name"
            placeholderText="Enter your name"
            value={formData.name}
            onChange={handleInputChange}
            name="name"
          />
          {errors.name && <p className="error">{errors.name}</p>}
        </div>

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

        <Button buttonText="Register" className="submit-button" />
        {serverError && <p className="server-error">{serverError}</p>}
        {successMessage && <p className="success-message">{successMessage}</p>}
        <p className="form-footer">
          Already have an account? <Link to="/login">Login</Link>  
        </p>
      </form>
    </div>
  );
}

export default Registration;
