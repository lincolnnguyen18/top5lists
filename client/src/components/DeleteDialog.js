import * as React from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import { TextField } from '@mui/material';

export default function DeleteDialog(props) {
  const handleClose = () => {
    props.setOpen(false);
  };

  const descriptionElementRef = React.useRef(null);
  React.useEffect(() => {
    if (open) {
      
    }
  }, [open]);

  return (
    <Dialog
      open={props.open}
      onClose={handleClose}
      scroll='paper'
    >
      <DialogTitle id="scroll-dialog-title">Delete List?</DialogTitle>
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
          <Button onClick={handleClose} color="primary">Cancel</Button>
          <Button onClick={() => props.handleDelete(props.deleteItem)}>Confirm</Button>
        </div>
      </DialogActions>
    </Dialog>
  );
}