import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthLayout } from '../layouts/AuthLayout';
import { Input } from '../components/Input';
import { Button } from '../components/Button';
import { register } from '../services/authService';
import { useAuth } from '../context/AuthContext';
import type { Role } from '../types';
import { User, Stethoscope, ShieldCheck, AlertCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { MEDICAL_SPECIALTIES } from '../constants/specialties';

export const Register: React.FC = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [specialty, setSpecialty] = useState('');
  const [role, setRole] = useState<Role>('patient');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const navigate = useNavigate();
  const { login: login_ctx } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      if (!name || !email || !phone || !password) {
        throw new Error('Please fill all required fields');
      }

      // Email validation
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        throw new Error('Please enter a valid email address');
      }

      // Phone validation
      const phoneRegex = /^\d{10}$/;
      if (!phoneRegex.test(phone)) {
        throw new Error('Phone number must be exactly 10 digits');
      }

      // Password validation
      if (password.length < 6) {
        throw new Error('Password must be at least 6 characters long');
      }

      if (role === 'doctor' && !specialty.trim()) {
        throw new Error('Please enter your medical specialty');
      }

      const { user } = await register({
        name,
        email,
        phone,
        password,
        role,
        specialty: role === 'doctor' ? specialty : undefined,
      });

      login_ctx(user);

      // Redirect based on role
      switch (user.role) {
        case 'doctor':
          navigate('/doctor');
          break;
        case 'admin':
          navigate('/admin');
          break;
        case 'patient':
        default:
          navigate('/dashboard');
          break;
      }
    } catch (err: any) {
      const serverMessage = err?.response?.data?.message;
      setError(serverMessage || err.message || 'Registration failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const roles: { value: Role; label: string; icon: React.ElementType }[] = [
    { value: 'patient', label: 'Patient', icon: User },
    { value: 'doctor', label: 'Doctor', icon: Stethoscope },
    { value: 'admin', label: 'Admin', icon: ShieldCheck },
  ];

  return (
    <AuthLayout
      title="Create Account"
      subtitle="Join MediQueue to manage appointments efficiently"
      footerText="Already have an account?"
      footerLinkText="Log in here"
      footerLinkTo="/login"
    >
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column' }}>
        <AnimatePresence>
          {error && (
            <motion.div
              className="auth-error"
              initial={{ opacity: 0, height: 0, y: -10 }}
              animate={{ opacity: 1, height: 'auto', y: 0 }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
            >
              <AlertCircle size={20} />
              <span>{error}</span>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Role Selector */}
        <div style={{ marginBottom: '0.5rem' }}>
          <span className="role-label">I am registering as a:</span>
          <div className="role-group">
            {roles.map((r) => {
              const Icon = r.icon;
              return (
                <label key={r.value} className={`role-card ${role === r.value ? 'active' : ''}`}>
                  <input
                    type="radio"
                    name="role"
                    value={r.value}
                    checked={role === r.value}
                    onChange={(e) => setRole(e.target.value as Role)}
                  />
                  <div className="role-card-icon">
                    <Icon size={24} strokeWidth={role === r.value ? 2.5 : 2} />
                  </div>
                  <span className="role-card-text">{r.label}</span>
                </label>
              );
            })}
          </div>
        </div>

        <Input
          label="Full Name"
          type="text"
          placeholder="Enter your full name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
        <Input
          label="Email Address"
          type="email"
          placeholder="Enter your email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <Input
          label="Phone Number"
          type="tel"
          placeholder="Enter your phone number"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          required
        />


        {/* Specialty — visible only when registering as Doctor */}
        <AnimatePresence>
          {role === 'doctor' && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.25 }}
              style={{ overflow: 'hidden', marginBottom: '1.25rem' }}
            >
              <div className="input-group">
                <label className="input-label">Medical Specialty</label>
                <select
                  className="auth-select"
                  value={specialty}
                  onChange={(e) => setSpecialty(e.target.value)}
                  required={role === 'doctor'}
                  style={{
                    width: '100%',
                    padding: '0.75rem 1rem',
                    borderRadius: '0.625rem',
                    border: '1px solid var(--border)',
                    background: 'var(--bg-color)',
                    color: 'var(--text-dark)',
                    fontSize: '0.875rem',
                    outline: 'none',
                    cursor: 'pointer'
                  }}
                >
                  <option value="">Select your specialty</option>
                  {MEDICAL_SPECIALTIES.map(s => (
                    <option key={s} value={s}>{s}</option>
                  ))}
                </select>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <Input
          label="Password"
          type="password"
          placeholder="Create a strong password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        <Button type="submit" fullWidth isLoading={isLoading} style={{ marginTop: '1rem', padding: '0.875rem' }}>
          Create Account
        </Button>
      </form>
    </AuthLayout>
  );
};

