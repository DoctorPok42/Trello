import React, { useState } from 'react';
import { FAB as Fab, Portal } from 'react-native-paper';

interface AddButtonProps {
  options: any;
}

const AddButton = ({
  options,
}: AddButtonProps) => {
   const [state, setState] = useState({ open: false });

  const onStateChange = ({ open }) => setState({ open });

  const { open } = state;

  return (
    <Portal>
      <Fab.Group
        open={open}
        visible
        icon={open ? 'arrow-up-bold-circle' : 'plus-circle'}
        actions={
          options.map((option: any) => ({
            ...option,
            color: '#fff',
            style: { backgroundColor: "#0079BF" },
          }))
        }
        onStateChange={onStateChange}
        color='#fff'
        fabStyle={{ backgroundColor: '#0079BF' }}
      />
    </Portal>
  );
};

export default AddButton;
