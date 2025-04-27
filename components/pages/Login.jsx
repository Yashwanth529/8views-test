

import React, { useState } from 'react';
import { useRouter } from 'next/router';
import { auth } from '../../auth/firebase';
import { signInWithEmailAndPassword } from 'firebase/auth';

const Login = () => {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [generalError, setGeneralError] = useState('');
  const [loading, setLoading] = useState(false);

  const validateEmail = (value) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    setEmailError(!emailRegex.test(value) ? 'Please enter a valid email' : '');
  };

  const validatePassword = (value) => {
    setPasswordError(value.length < 6 ? 'Password must be at least 6 characters' : '');
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setGeneralError('');

    if (emailError || passwordError || !email || !password) {
      setGeneralError('Please enter the values');
      return;
    }

    setLoading(true);
    try {
      await signInWithEmailAndPassword(auth, email, password);
      router.push('/home');
    } catch (err) {
      setGeneralError(err.message.replace('Firebase:', '').trim());
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      <h2 style={styles.title}>Login</h2>
      {generalError && <p style={styles.error}>{generalError}</p>}

      <form onSubmit={handleLogin} style={styles.form}>
        <input
          style={styles.input}
          type="email"
          placeholder="Email"
          value={email}
          disabled={loading}
          onChange={(e) => {
            setEmail(e.target.value);
            validateEmail(e.target.value);
          }}
        />
        {emailError && <p style={styles.inputError}>{emailError}</p>}

        <input
          style={styles.input}
          type="password"
          placeholder="Password"
          value={password}
          disabled={loading}
          onChange={(e) => {
            setPassword(e.target.value);
            validatePassword(e.target.value);
          }}
        />
        {passwordError && <p style={styles.inputError}>{passwordError}</p>}

        <button
          type="submit"
          disabled={loading}
          style={{
            ...styles.button,
            ...(loading ? styles.buttonDisabled : {})
          }}
        >
          {loading ? 'Logging in...' : 'Login'}
        </button>
      </form>

      <p style={styles.signupText}>
        Don't have an account?{' '}
        <a href="/signup" style={styles.link}>Sign up</a>
      </p>
    </div>
  );
};

const styles = {
  container: {
    maxWidth: '400px',
    margin: '100px auto',
    padding: '20px',
    textAlign: 'center',
    border: '1px solid #ddd',
    borderRadius: '8px',
    backgroundColor: '#fff',
    boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
  },
  title: {
    marginBottom: '20px',
    fontSize: '24px',
    fontWeight: 'bold',
  },
  error: {
    color: 'red',
    marginBottom: '10px',
  },
  inputError: {
    color: 'red',
    marginTop: '-10px',
    marginBottom: '10px',
    fontSize: '12px',
    textAlign: 'left',
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
  },
  input: {
    marginBottom: '10px',
    padding: '12px',
    fontSize: '16px',
    borderRadius: '4px',
    border: '1px solid #ccc',
    outline: 'none',
  },
  button: {
    padding: '10px',
    fontSize: '16px',
    backgroundColor: '#0070f3',
    color: '#fff',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
  },
  buttonDisabled: {
    opacity: 0.6,
    cursor: 'not-allowed',
  },
  signupText: {
    marginTop: '15px',
    fontSize: '14px',
  },
  link: {
    color: '#0070f3',
    textDecoration: 'none',
  },
};

export default Login;
