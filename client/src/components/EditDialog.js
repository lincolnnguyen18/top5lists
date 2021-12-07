import * as React from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import { TextField } from '@mui/material';

export default function ScrollDialog(props) {
  const [listName, setListName] = React.useState('');
  const [item1, setItem1] = React.useState('');
  const [item2, setItem2] = React.useState('');
  const [item3, setItem3] = React.useState('');
  const [item4, setItem4] = React.useState('');
  const [item5, setItem5] = React.useState('');

  const handleClose = () => {
    props.setOpen(false);
  };

  const handleSave = () => {
    // console.log('saving')
    // console.log({ listName, item1, item2, item3, item4, item5 });
    // console.log(props.openItem.name, props.openItem.list);
    // let listName2 = listName;
    if (props.openItem.name !== listName) {
      fetch('/api/renameList', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          listName: props.openItem.name,
          newListName: listName
        })
      })
      .then(res => res.json())
      .then(res => {
        console.log(res);
        props.updateRes()
        handleClose();
      })
    }
    if (JSON.stringify(props.openItem.list) !== JSON.stringify([item1, item2, item3, item4, item5])) {
      fetch('/api/editList', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          listName: props.openItem.name,
          list: [item1, item2, item3, item4, item5]
        })
      })
      .then(res => res.json())
      .then(res => {
        console.log(res);
        props.updateRes()
        handleClose();
      })
    }
  }
     
  const handlePublish = () => {
    fetch('/api/renameList', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        listName: props.openItem.name,
        newListName: listName
      })
    }).then(res => res.json())
    .then(res => {
      console.log(res);
      fetch('/api/editList', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          listName: listName,
          list: [item1, item2, item3, item4, item5]
        })
      }).then(res => res.json())
      .then(res => {
        console.log(res);
        fetch('/api/publishList', {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            listName: listName
          })
        })
        .then(res => res.json())
        .then(res => {
          console.log(res);
          props.updateRes()
          handleClose();
        })
      })
    })
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
      scroll='paper'
    >
      <DialogTitle>
        Edit List
      </DialogTitle>
      <DialogContent dividers={scroll === 'paper'} style={{
        display: 'flex',
        flexDirection: 'column',
      }}>
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