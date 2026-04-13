import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthLayout } from '../layouts/AuthLayout';
import { Input } from '../components/Input';
import { Button } from '../components/Button';
import { mockRegister } from '../services/authService';
import { useAuth } from '../context/AuthContext';
import type { Role } from '../types';

export const Register: React.FC = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<Role>('patient');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      if (!name || !email || !password) {
        throw new Error('Please fill all fields');
      }
      
      const user = await mockRegister(name, email, role);
      login(user);
      
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
      setError(err.message || 'Registration failed');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthLayout
      title="Create Account"
      subtitle="Join MediQueue to manage appointments"
      footerText="Already have an account?"
      footerLinkText="Log in here"
      footerLinkTo="/login"
    >
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        {error && (
          <div style={{ backgroundColor: 'var(--danger)', color: '#fff', padding: '0.75rem', borderRadius: 'var(--radius-md)', fontSize: '0.875rem' }}>
            {error}
          </div>
        )}
        
        <div style={{ display: 'flex', flexDirection: 'column', marginBottom: '0.5rem' }}>
          <label style={{ fontSize: '0.875rem', fontWeight: 500, marginBottom: '0.5rem', color: 'var(--text-dark)' }}>
            Register as a
          </label>
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            {(['patient', 'doctor', 'admin'] as Role[]).map((r) => (
              <label key={r} style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', cursor: 'pointer', fontSize: '0.875rem', textTransform: 'capitalize' }}>
                <input 
                  type="radio" 
                  name="role" 
                  value={r} 
                  checked={role === r} 
                  onChange={(e) => setRole(e.target.value as Role)}
                />
                {r}
              </label>
            ))}
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
          label="Password" 
          type="password" 
          placeholder="Create a password" 
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required 
        />

        <Button type="submit" fullWidth isLoading={isLoading} style={{ marginTop: '0.5rem' }}>
          Create Account
        </Button>
      </form>
    </AuthLayout>
  );
};
