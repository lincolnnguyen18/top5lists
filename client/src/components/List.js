import * as React from 'react';
import Box from '@mui/material/Box';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import { Button } from '@mui/material';
import { FixedSizeList } from 'react-window';
import Dialog from './ViewDialog';

export default function List(props) {
  const [open, setOpen] = React.useState(false);
  const [openItem, setOpenItem] = React.useState(null);

  const handleListClick = (item) => {
    if (!item.published) {
      return;
    }
    console.log('List item clicked', item);
    setOpenItem(item);
    setOpen(true);
  };

  return (
    <>
      <Dialog open={open} setOpen={setOpen} openItem={openItem} />
      <div style={{
        height: '70%',
        overflow: 'auto',
        width: '80%',
      }}>
        {props.data.map((item, index) => (
          <div key={index} style={{
            display: 'flex',
            justifyContent: 'space-between',
            padding: '5px 20px',
            paddingTop: '0px',
            borderBottom: '1px solid #ccc',
          }} className='cursor' onClick={() => handleListClick(item)}>
            <div>
              <h4>{item.name}</h4>
              <p>By: <a href="#">{item.username}</a></p>
              {item.published ? <p>Published: {(new Date(item.publishedDate)).toDateString()}</p> : <a href="#">Edit</a>}
            </div>
            <div style={{
              display: 'flex',
              flexDirection: 'column',
            }}>
              <div style={{
              display: 'flex',
              flexDirection: 'row',
              alignItems: 'center',
              gap: '10px',
              }}>
                <svg style={{width: '30px'}} xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017c-.163 0-.326-.02-.485-.06L7 20m7-10V5a2 2 0 00-2-2h-.095c-.5 0-.905.405-.905.905 0 .714-.211 1.412-.608 2.006L7 11v9m7-10h-2M7 20H5a2 2 0 01-2-2v-6a2 2 0 012-2h2.5" />
                </svg>
                <p>{item.likes}</p>
                <svg style={{width: '30px'}} xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 14H5.236a2 2 0 01-1.789-2.894l3.5-7A2 2 0 018.736 3h4.018a2 2 0 01.485.06l3.76.94m-7 10v5a2 2 0 002 2h.096c.5 0 .905-.405.905-.904 0-.715.211-1.413.608-2.008L17 13V4m-7 10h2m5-10h2a2 2 0 012 2v6a2 2 0 01-2 2h-2.5" />
                </svg>
                <p>{item.dislikes}</p>
              </div>
              <div style={{
                display: 'flex',
                flexDirection: 'row',
                alignItems: 'center',
                justifyItems: 'space-between',
                gap: '10px',
              }}>
                <p>Views: {item.views}</p>
                <a href="#">Delete</a>
              </div>
            </div>
          </div>
        ))}
      </div>
    </>
  );
}