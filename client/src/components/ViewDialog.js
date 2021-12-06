import * as React from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import { TextField } from '@mui/material';

export default function ScrollDialog(props) {
  const handleClose = () => {
    props.setOpen(false);
  };

  const descriptionElementRef = React.useRef(null);
  React.useEffect(() => {
    if (open) {
      const { current: descriptionElement } = descriptionElementRef;
      if (descriptionElement !== null) {
        descriptionElement.focus();
      }
    }
  }, [open]);

  return (
    <Dialog
      open={props.open}
      onClose={handleClose}
      scroll='paper'
    >
      <DialogTitle id="scroll-dialog-title">
        <div style={{
          display: 'flex',
          flexDirection: 'row',
          alignItems: 'center',
          gap: '10px',
        }}>
          <h4>{props.openItem ? props.openItem.name : 'Loading...'}</h4>
          <p>By: <a href="#">{props.openItem ? props.openItem.username : 'Loading...'}</a></p>
        </div>
        <div style={{
          display: 'flex',
          flexDirection: 'row',
          alignItems: 'center',
          gap: '10px',
        }}>
          <svg style={{ width: '30px' }} xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017c-.163 0-.326-.02-.485-.06L7 20m7-10V5a2 2 0 00-2-2h-.095c-.5 0-.905.405-.905.905 0 .714-.211 1.412-.608 2.006L7 11v9m7-10h-2M7 20H5a2 2 0 01-2-2v-6a2 2 0 012-2h2.5" />
          </svg>
          <p>{props.openItem ? props.openItem.likes : 'Loading...'}</p>
          <svg style={{ width: '30px' }} xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 14H5.236a2 2 0 01-1.789-2.894l3.5-7A2 2 0 018.736 3h4.018a2 2 0 01.485.06l3.76.94m-7 10v5a2 2 0 002 2h.096c.5 0 .905-.405.905-.904 0-.715.211-1.413.608-2.008L17 13V4m-7 10h2m5-10h2a2 2 0 012 2v6a2 2 0 01-2 2h-2.5" />
          </svg>
          <p>{props.openItem ? props.openItem.dislikes : 'Loading...'}</p>
          <p style={{marginLeft: '1em'}}><a href="#">Delete</a></p>
        </div>
        <div style={{
          display: 'flex',
          flexDirection: 'row',
          alignItems: 'center',
          gap: '10px',
        }}>
          {props.openItem && props.openItem.published ? <p>Published: {(new Date(props.openItem.publishedDate)).toDateString()}</p> : null}
          {props.openItem ? <p>Views: {props.openItem.views}</p> : null}
        </div>
        <div>
          <ol>
            {props.openItem ? props.openItem.list.map((item, index) => {
              return (
                <li key={index}>{item}</li>
              )
            }) : 'Loading...'}
          </ol>
        </div>
      </DialogTitle>
      <DialogContent dividers={scroll === 'paper'}>
        <DialogContentText
          tabIndex={-1}
        >
          {props.openItem && props.openItem.comments.length > 0 ? props.openItem.comments.map((comment, index) => {
            return (
              <div key={index}>
                <p>{comment.username}</p>
                <p>{comment.comment}</p>
              </div>
            )
          }) : 'No comments'}
        </DialogContentText>
      </DialogContent>
      <DialogActions style={{
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        justifyItems: 'space-between',
      }}>
        <div style={{
          display: 'flex',
          flexDirection: 'row',
          alignItems: 'center',
          gap: '10px',
        }}>
          <TextField id="outlined-basic" label="Comment" variant="outlined" autoComplete="off"/>
          <Button onClick={handleClose} color="primary">Submit Comment</Button>
        </div>
        <Button onClick={handleClose}>Close</Button>
      </DialogActions>
    </Dialog>
  );
}