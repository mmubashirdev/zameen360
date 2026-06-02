

import { useContext } from 'react';
import { PropertyContext } from './PropertyContext';

export const useProperty = () => {
  const ctx = useContext(PropertyContext);
  if (!ctx) throw new Error('useProperty must be used inside PropertyProvider');
  return ctx;
};