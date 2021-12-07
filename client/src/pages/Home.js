import * as React from 'react';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Button from '@mui/material/Button';
import { Link, useNavigate } from 'react-router-dom';
import { loggedIn } from '../components/Methods';
import Loading from '../components/Loading';
import './StartPage.css';
import List from '../components/List';
import MenuItem from '@mui/material/MenuItem';
import Menu from '@mui/material/Menu';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import AccountCircle from '@mui/icons-material/AccountCircle';
import { TextField } from '@mui/material';

export default function Home() {
  let [loaded, setLoaded] = React.useState(false);
  let [lists, setLists] = React.useState([]);
  let [res, setRes] = React.useState({});
  let [sortMode, setSortMode] = React.useState('likesDesc');
  let [menuOpen, setMenuOpen] = React.useState(false);
  let [anchorEl, setAnchorEl] = React.useState(null);
  let [searchText, setSearchText] = React.useState('');
  const navigate = useNavigate();

  const handleSearch = () => {
    console.log(searchText);
    updateRes();
  }

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
    let url = '/api/viewPersonalListsByName';
    if (searchText.trim() !== '') {
      url = '/api/viewPersonalListsByName?listNameStartsWith=' + searchText;
    }
    fetch(url, {
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
        width: 'fit-content',
        minWidth: '700px',
        height: '100%',
        margin: 'auto',
      }}>
        <h1>Home</h1>
        <List data={lists} updateRes={updateRes} />
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
          <div style={{
            display: 'flex',
            flexDirection: 'row',
            gap: '1em',
            alignItems: 'center',
          }}>
            <TextField id="outlined-basic" label="Search" variant="outlined" autoComplete="no" style={{
              backgroundColor: 'white'
            }} onChange={(e) => {
              setSearchText(e.target.value);
            }} />
            <Button onClick={(e) => {
              handleSearch();
            }} style={{
              color: 'white',
            }}>Search</Button>
            <Button onClick={(e) => {
              setAnchorEl(e.currentTarget);
              setMenuOpen(true);
            }} style={{
              color: 'white',
            }}>Sort by</Button>
            <Menu
              id="menu-appbar"
              anchorEl={anchorEl}
              anchorOrigin={{
                vertical: 'top',
                horizontal: 'right',
              }}
              keepMounted
              transformOrigin={{
                vertical: 'top',
                horizontal: 'right',
              }}
              open={menuOpen}
              onClose={() => setMenuOpen(false)}
            >
              <MenuItem onClick={() => { 
                setMenuOpen(false);
                setSortMode('publishedDateDesc');
              }}>Published Date (Newest)</MenuItem>
              <MenuItem onClick={() => {
                setMenuOpen(false);
                setSortMode('publishedDateAsc');
              }}>Published Date (Oldest)</MenuItem>
              <MenuItem onClick={() => {
                setMenuOpen(false);
                setSortMode('viewsDesc');
              }}>Views</MenuItem>
              <MenuItem onClick={() => {
                setMenuOpen(false);
                setSortMode('likesDesc');
              }}>Likes</MenuItem>
              <MenuItem onClick={() => {
                setMenuOpen(false);
                setSortMode('dislikesDesc');
              }}>Dislikes</MenuItem>
            </Menu>
            <Button color="inherit" onClick={handleLogout}>Logout</Button>
          </div>
        </Toolbar>
      </AppBar>
      {loaded ? page : <Loading />}
    </>
  );
}