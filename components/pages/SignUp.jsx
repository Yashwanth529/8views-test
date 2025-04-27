import React, { useState } from 'react';
import { useRouter } from 'next/router';
import { auth } from '../../auth/firebase'; 
import { createUserWithEmailAndPassword } from 'firebase/auth'; 

const Signup = () => {
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

  const handleSignup = async (e) => {
    e.preventDefault();
    setGeneralError('');

    if (emailError || passwordError || !email || !password) {
      setGeneralError('Please fill the inputs');
      return;
    }

    setLoading(true);
    try {
      await createUserWithEmailAndPassword(auth, email, password);
      router.push('/login');
    } catch (err) {
      setGeneralError(err.message.replace('Firebase:', '').trim());
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      <h2 style={styles.title}>Sign Up</h2>
      {generalError && <p style={styles.error}>{generalError}</p>}

      <form onSubmit={handleSignup} style={styles.form}>
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
          {loading ? 'Signing Up...' : 'Sign Up'}
        </button>
      </form>

      <p style={styles.loginText}>
        Already have an account?{' '}
        <a href="/login" style={styles.link}>Login</a>
      </p>
    </div>
  );
};

const styles = {
  container: {
    width: '90%',
    maxWidth: '400px',
    margin: '100px auto',
    padding: '20px',
    textAlign: 'center',
    border: '1px solid #ddd',
    borderRadius: '8px',
    backgroundColor: '#fafafa',
    boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
  },
  title: {
    marginBottom: '20px',
    fontSize: '26px',
    fontWeight: 'bold',
  },
  error: {
    color: 'red',
    marginBottom: '10px',
    fontSize: '14px',
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
    borderRadius: '6px',
    border: '1px solid #ccc',
    outline: 'none',
  },
  button: {
    marginTop: '10px',
    padding: '12px',
    fontSize: '16px',
    backgroundColor: '#0070f3',
    color: '#fff',
    border: 'none',
    borderRadius: '6px',
    cursor: 'pointer',
    transition: 'background-color 0.3s ease',
  },
  buttonDisabled: {
    opacity: 0.6,
    cursor: 'not-allowed',
  },
  loginText: {
    marginTop: '20px',
    fontSize: '14px',
  },
  link: {
    color: '#0070f3',
    textDecoration: 'underline',
    cursor: 'pointer',
  }
};

export default Signup;
