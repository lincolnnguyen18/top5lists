import * as React from 'react';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Button from '@mui/material/Button';
import { Link, useNavigate } from 'react-router-dom';
import { loggedIn } from '../components/Methods';
import Loading from '../components/Loading';
import './StartPage.css';

export default function NotFound() {
  const navigate = useNavigate();

  React.useEffect(() => {
    // loggedIn().then(res => {
    //   if (!res) {
    //     navigate('/login');
    //   } else {
    //     setLoaded(true);
    //   }
    // });
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
        margin: 'auto',
        height: '100%',
      }}>
        <h1>Page not found</h1>
      </div>
    </>
  );

  const handleLogout = () => {
    fetch('/api/logout', {
      method: 'POST'
    }).then(res => {
      res.json().then(data => {
        console.log(data);
        navigate('/login');
      });
    });
  };

  return (
    <>
      <AppBar position="fixed">
        <Toolbar style={{
          display: 'flex',
          justifyContent: 'space-between',
        }}>
          <Link to="/" style={{textDecoration: 'none', color: 'white'}}><h2>Top 5 Lister</h2></Link>
          <Button color="inherit" onClick={handleLogout}>Logout</Button>
        </Toolbar>
      </AppBar>
      {page}
    </>
  );
}