import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthLayout } from '../layouts/AuthLayout';
import { Input } from '../components/Input';
import { Button } from '../components/Button';
import { login } from '../services/authService';
import { useAuth } from '../context/AuthContext';
import type { Role } from '../types';
import { User, Stethoscope, ShieldCheck, AlertCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';


export const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
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
      if (!email || !password) {
        throw new Error('Please fill all fields');
      }
      
      const { user } = await login({ email, password, role });
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
      // Surface the server error message if available
      const serverMessage = err?.response?.data?.message;
      setError(serverMessage || err.message || 'Login failed. Please try again.');
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
      title="Welcome Back"
      subtitle="Log in to your MediQueue account"
      footerText="Don't have an account?"
      footerLinkText="Register here"
      footerLinkTo="/register"
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
        
        <div style={{ marginBottom: '0.5rem' }}>
          <span className="role-label">I am logging in as a:</span>
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
          label="Email Address" 
          type="email" 
          placeholder="Enter your email" 
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required 
        />
        <Input 
          label="Password" 
          type="password" 
          placeholder="Enter your password" 
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required 
        />

        <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '1.5rem', marginTop: '-0.5rem' }}>
          <a href="#" style={{ fontSize: '0.875rem', color: 'var(--primary)', fontWeight: 500, textDecoration: 'none' }}>
            Forgot password?
          </a>
        </div>

        <Button type="submit" fullWidth isLoading={isLoading} style={{ padding: '0.875rem' }}>
          Sign In
        </Button>
      </form>
    </AuthLayout>
  );
};
