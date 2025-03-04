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
        actions={options}
        onStateChange={onStateChange}
      />
    </Portal>
  );
};

export default AddButton;
