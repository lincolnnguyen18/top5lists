import * as React from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import { TextField } from '@mui/material';

export default function CreateListDialog(props) {
  const [listName, setListName] = React.useState('');
  const [item1, setItem1] = React.useState('');
  const [item2, setItem2] = React.useState('');
  const [item3, setItem3] = React.useState('');
  const [item4, setItem4] = React.useState('');
  const [item5, setItem5] = React.useState('');
  const [error, setError] = React.useState('');

  const handleClose = () => {
    props.setOpen(false);
  };

  React.useEffect(() => {
    if (props.open) {
      setListName('');
      setItem1('');
      setItem2('');
      setItem3('');
      setItem4('');
      setItem5('');
      setError('');
    }
  }, [props.open]);

  const handleSave = () => {
    fetch('/api/createList', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        listName,
        list: [item1, item2, item3, item4, item5],
      }),
    }).then(res => {
      if (res.status === 200) {
        props.setOpen(false);
        props.updateRes();
      } else {
        res.json().then(data => {
          setError(data.error);
          setTimeout(() => {
            setError('');
          }, 3000);
        });
      }
    });
  }

  const handlePublish = () => {
    fetch('/api/createList', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        listName,
        list: [item1, item2, item3, item4, item5],
      }),
    }).then(res => {
      if (res.status === 200) {
        fetch('/api/publishList', {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            listName,
          }),
        }).then(res => {
          if (res.status === 200) {
            props.setOpen(false);
            props.updateRes();
          } else {
            res.json().then(data => {
              setError(data.error);
              setTimeout(() => {
                setError('');
              }, 3000);
            });
          }
        }); 
      } else {
        res.json().then(data => {
          setError(data.error);
          setTimeout(() => {
            setError('');
          }, 3000);
        });
      }
    });
  }

  React.useEffect(() => {
    if (props.openItem) {
      setListName(props.openItem.name);
      props.openItem.list.map((item, index) => {
        if (index === 0) {
          setItem1(item);
        } else if (index === 1) {
          setItem2(item);
        } else if (index === 2) {
          setItem3(item);
        } else if (index === 3) {
          setItem4(item);
        } else if (index === 4) {
          setItem5(item);
        }
      }
      );
    }
  }, [props.openItem]);

  return (
    <Dialog
      open={props.open}
      onClose={handleClose}
    >
      <DialogTitle>
        Edit List
      </DialogTitle>
      <DialogContent style={{
        display: 'flex',
        flexDirection: 'column',
      }}>
        {error ? <p style={{color: 'red'}}>{error}</p> : null}
        <TextField label="List Name" variant="filled" fullWidth value={listName} onChange={(e) => setListName(e.target.value)} />
        <ol>
          <li><TextField label="Item 1" variant="filled" fullWidth value={item1} onChange={(e) => setItem1(e.target.value)} /></li>
          <li><TextField label="Item 2" variant="filled" fullWidth value={item2} onChange={(e) => setItem2(e.target.value)} /></li>
          <li><TextField label="Item 3" variant="filled" fullWidth value={item3} onChange={(e) => setItem3(e.target.value)} /></li>
          <li><TextField label="Item 4" variant="filled" fullWidth value={item4} onChange={(e) => setItem4(e.target.value)} /></li>
          <li><TextField label="Item 5" variant="filled" fullWidth value={item5} onChange={(e) => setItem5(e.target.value)} /></li>
        </ol>
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
          <Button onClick={handleSave} color="primary">Save</Button>
          <Button onClick={handlePublish}>Publish</Button>
          <Button onClick={handleClose}>Cancel</Button>
        </div>
      </DialogActions>
    </Dialog>
  );
}