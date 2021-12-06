import * as React from 'react';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import { Link, useNavigate } from 'react-router-dom';
import './StartPage.css';
import Loading from '../components/Loading';
import { loggedIn } from '../components/Methods';

export default function Register() {
  let [username, setUsername] = React.useState('');
  let [password, setPassword] = React.useState('');
  let [confirmPassword, setConfirmPassword] = React.useState('');
  let [email, setEmail] = React.useState('');
  let [firstName, setFirstName] = React.useState('');
  let [lastName, setLastName] = React.useState('');
  let [error, setError] = React.useState('');
  let [loaded, setLoaded] = React.useState(false);
  const navigate = useNavigate();

  React.useEffect(() => {
    loggedIn().then(res => {
      if (res) {
        navigate('/home');
      } else {
        setLoaded(true);
      }
    });
  }, []);

  const handleSubmit = (event) => {
    console.log({username, password, confirmPassword, email, firstName, lastName});
    if (!username || !password || !confirmPassword || !email || !firstName || !lastName) {
      setError('Please fill out all fields');
    } else if (password !== confirmPassword) {
      setError('Passwords do not match');
    } else {
      setError('');
      fetch('/api/createAccount', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          username,
          password,
          email,
          firstName,
          lastName
        })
      })
      .then(res => res.json())
      .then(res => {
        console.log(res);
        if (res.error) {
          setError(res.error);
        }
        else {
          navigate('/home');
        }
      });
    }
  };

  let page = (
    <>
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'column',
        backgroundColor: '#fff',
        padding: '3em',
        width: 'fit-content',
        minWidth: '700px',
        margin: 'auto',
        height: '100%',
      }}>
        <h1>Register</h1>
        <div style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          flexDirection: 'column',
          gap: '1em',
        }}>
          <TextField label="Username" variant="outlined" onChange={(e) => setUsername(e.target.value)} />
          <TextField label="First Name" variant="outlined" onChange={(e) => setFirstName(e.target.value)} />
          <TextField label="Last Name" variant="outlined" onChange={(e) => setLastName(e.target.value)} />
          <TextField label="Email" variant="outlined" onChange={(e) => setEmail(e.target.value)} />
          <TextField label="Password" variant="outlined" type="password" onChange={(e) => setPassword(e.target.value)} />
          <TextField label="Confirm Password" variant="outlined" type="password" onChange={(e) => setConfirmPassword(e.target.value)} />
          {error ? <p style={{ color: 'red' }}>{error}</p> : null}
        </div>
        <div style={{ 
          display: 'flex',
          flexDirection: 'row',
          gap: '3em',
          marginTop: '1em',
        }}>
          <Link to="/" style={{textDecoration: 'none'}}><Button variant="contained" color="primary">Back</Button></Link>
          <Button variant="contained" color="primary" onClick={handleSubmit}>Submit</Button>
        </div>
      </div>
    </>
  );

  return (
    <>
      <AppBar position="fixed">
        <Toolbar>
          <Link to="/" style={{textDecoration: 'none', color: 'white'}}><h2>Top 5 Lister</h2></Link>
        </Toolbar>
      </AppBar>
      {loaded ? page : <Loading />}
    </>
  );
}