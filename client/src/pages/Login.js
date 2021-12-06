import * as React from 'react';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import { Link, useNavigate } from 'react-router-dom';
import './StartPage.css';
import Loading from '../components/Loading';
import { loggedIn } from '../components/Methods';

export default function Login() {
  let [username, setUsername] = React.useState('');
  let [password, setPassword] = React.useState('');
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
    console.log({username, password});
    if (!username || !password) {
      setError('Please fill out all fields');
    } else {
      setError('');
      fetch('/api/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          username,
          password
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
        <h1>Login</h1>
        <div style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          flexDirection: 'column',
          gap: '1em',
        }}>
          <TextField label="Username" variant="outlined" onChange={(e) => setUsername(e.target.value)} />
          <TextField label="Password" variant="outlined" type="password" onChange={(e) => setPassword(e.target.value)} />
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