import * as React from 'react';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Button from '@mui/material/Button';
import { Link, useNavigate } from 'react-router-dom';
import { loggedIn } from '../components/Methods';
import Loading from '../components/Loading';
import './StartPage.css';

export default function StartPage() {
  const [loaded, setLoaded] = React.useState(false);
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
        height: '100%',
        margin: 'auto',
      }}>
        <h1>Welcome to Top 5 Lister</h1>
        <div style={{ 
          display: 'flex',
          flexDirection: 'row',
          gap: '3em',
          marginTop: '1em',
        }}>
          <Link to="/register" style={{textDecoration: 'none'}}><Button variant="contained" color="primary">Create Account</Button></Link>
          <Link to="/login" style={{textDecoration: 'none'}}><Button variant="contained" color="primary">Login</Button></Link>
          <Button variant="contained" color="primary">Continue as Guest</Button>
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