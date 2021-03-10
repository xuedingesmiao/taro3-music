import { useState, useEffect, useRef } from 'react';

export const useField = type => {
  const [value, setValue] = useState('');

  const onChange = e => {
    if (e.target) {
      setValue(e.target.value);
    } else {
      setValue(e);
    }
  };

  return {
    type,
    value,
    onChange
  };
};

export const useMount = mountedFn => {
  const mountedFnRef = useRef(null);

  mountedFnRef.current = mountedFn;

  useEffect(() => {
    mountedFnRef.current();
  }, [mountedFnRef]);
};
