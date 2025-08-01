'use client'
import React, { useState } from 'react'
import { Button } from './ui/button'
import { Zap } from 'lucide-react'
import axios from 'axios'
import toast from 'react-hot-toast'

const SubscriptionButton = ({ isPro = false }: { isPro: boolean }) => {
  const [loading, setLoading] = useState(false);

  const onClick = async () => {
    try {
      setLoading(true);

      const res = await axios.get('/api/stripe');

      window.location.href = res.data.url
    } catch {
      toast.error('Something went wrong.')
    } finally {
      setLoading(false);
    }
  }

  return (
    <Button disabled={loading} variant={isPro ? "default" : 'premium'} onClick={onClick} className='cursor-pointer'>
      {isPro ? "Manage Subscription" : "Upgrade"}
      {!isPro && <Zap className='w-4 h-4 ml-2 fill-white' />}
    </Button>
  )
}

export default SubscriptionButton
