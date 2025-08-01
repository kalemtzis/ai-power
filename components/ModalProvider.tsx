'use client';
import React, { useEffect, useState } from 'react'
import ProModal from './ProModal';

const ModalProvider = () => {
  const [mounted, SetMounted] = useState(false);

  useEffect(() => {
    SetMounted(true);
  }, [])

  if (!mounted) return null;

  return (
    <div>
      <ProModal />
    </div>
  )
}

export default ModalProvider
