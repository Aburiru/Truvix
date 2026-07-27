import React, { useState } from 'react';
import { ViewMode } from '../types';

interface RegisterViewProps {
  onRegister: (token: string) => void;
  onNavigate: (mode: ViewMode) => void;
}

export const RegisterView: React.FC<RegisterViewProps> = ({ onRegister, onNavigate }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const response = await fetch('/api/register', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({ name, email, password }),
      });

      const data = await response.json();

      if (response.ok) {
        onRegister(data.access_token);
      } else {
        setError(data.message || 'Registration failed');
      }
    } catch (err) {
      setError('Network error');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0b1326] flex items-center justify-center p-4">
      <div className="bg-[#1e293b] p-8 rounded-2xl border border-[#334155] w-full max-w-md shadow-xl">
        <h2 className="text-3xl font-bold font-headline text-white mb-6 text-center">Create Account</h2>
        
        {error && (
          <div className="bg-red-500/10 border border-red-500/20 text-red-400 p-3 rounded-lg mb-4 text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm text-[#c7c4d7] mb-1">Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full bg-[#0b1326] border border-[#334155] rounded-lg p-3 text-white focus:border-[#8083ff] focus:outline-none"
              required
            />
          </div>
          <div>
            <label className="block text-sm text-[#c7c4d7] mb-1">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-[#0b1326] border border-[#334155] rounded-lg p-3 text-white focus:border-[#8083ff] focus:outline-none"
              required
            />
          </div>
          <div>
            <label className="block text-sm text-[#c7c4d7] mb-1">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-[#0b1326] border border-[#334155] rounded-lg p-3 text-white focus:border-[#8083ff] focus:outline-none"
              required
              minLength={8}
            />
          </div>
          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-gradient-to-r from-[#8083ff] to-[#6f00be] text-white py-3 rounded-lg font-semibold hover:opacity-90 disabled:opacity-50"
          >
            {isLoading ? 'Creating Account...' : 'Register'}
          </button>
        </form>
        
        <p className="mt-4 text-center text-sm text-[#c7c4d7]">
          Already have an account?{' '}
          <button onClick={() => onNavigate('login')} className="text-[#8083ff] hover:underline">
            Login
          </button>
        </p>
      </div>
    </div>
  );
};
