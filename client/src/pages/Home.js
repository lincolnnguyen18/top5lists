import * as React from 'react';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Button from '@mui/material/Button';
import { Link, useNavigate } from 'react-router-dom';
import { loggedIn } from '../components/Methods';
import Loading from '../components/Loading';
import './StartPage.css';
import List from '../components/List';

export default function Home() {
  let [loaded, setLoaded] = React.useState(false);
  let [lists, setLists] = React.useState([]);
  let [res, setRes] = React.useState({});
  let [sortMode, setSortMode] = React.useState('likesDesc');
  const navigate = useNavigate();

  const convertRes = () => {
    let arr = [];
    for (let username in res) {
      for (let list in res[username]) {
        arr.push(res[username][list]);
        arr[arr.length - 1].name = list;
        arr[arr.length - 1].username = username;
      }
    }
    switch (sortMode) {
      case 'publishedDateDesc':
        arr.sort((a, b) => {
          return new Date(b.publishedDate) - new Date(a.publishedDate);
        });
        break;
      case 'publishedDateAsc':
        arr.sort((a, b) => {
          if (!b.publishedDate) {
            return -1;
          }
          if (!a.publishedDate) {
            return 1;
          }
          return new Date(a.publishedDate) - new Date(b.publishedDate);
        });
        break;
      case 'viewsDesc':
        arr.sort((a, b) => {
          return b.views - a.views;
        });
        break;
      case 'likesDesc':
        arr.sort((a, b) => {
          return b.likes - a.likes;
        });
        break;
      case 'dislikesDesc':
        arr.sort((a, b) => {
          return b.dislikes - a.dislikes;
        });
        break;
    }
    console.log(arr);
    setLists(arr);
  };

  React.useEffect(() => {
    convertRes(res);
  }, [res, sortMode]);

  const updateRes = () => {
    fetch('/api/viewPersonalListsByName', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    }).then(res => res.json()).then(res => {
      console.log(res)
      setRes(res);
    });
  }

  React.useEffect(() => {
    loggedIn().then(res => {
      if (!res) {
        navigate('/login');
      } else {
        setLoaded(true);
        updateRes();
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
        <h1>Home</h1>
        <List data={lists} updateRes={updateRes} />
        {/* <div style={{ 
          display: 'flex',
          flexDirection: 'row',
          gap: '3em',
          marginTop: '1em',
        }}>
          <Link to="/register" style={{textDecoration: 'none'}}><Button variant="contained" color="primary">Create Account</Button></Link>
          <Link to="/login" style={{textDecoration: 'none'}}><Button variant="contained" color="primary">Login</Button></Link>
          <Button variant="contained" color="primary">Continue as Guest</Button>
        </div> */}
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
      {loaded ? page : <Loading />}
    </>
  );
}