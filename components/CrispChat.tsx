'use client'

import { useEffect } from "react"
import { Crisp } from 'crisp-sdk-web';

const CrispChat = () => {
  useEffect(() => {
    Crisp.configure("47c9f90a-4487-41a7-9aa1-f154179a0fa9");
  });

  return null;
}

export default CrispChat
