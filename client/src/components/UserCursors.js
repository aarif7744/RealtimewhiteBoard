
import React from 'react';

const UserCursors = ({ cursors }) => {
  return (
    <>
      {Object.entries(cursors).map(([id, { x, y }]) => (
        <div
          key={id}
          style={{
            position: 'absolute',
            top: y + 'px',
            left: x + 'px',
            width: 10,
            height: 10,
            backgroundColor: 'rgba(0,0,255,0.7)',
            borderRadius: '50%',
            pointerEvents: 'none',
            transform: 'translate(-50%, -50%)',
            zIndex: 1000
          }}
        />
      ))}
    </>
  );
};

export default UserCursors;
