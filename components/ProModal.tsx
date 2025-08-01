'use client'
import React, { useState } from 'react'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from './ui/dialog'
import { useProModal } from '@/hooks/use-pro-modal'
import { Badge } from './ui/badge'
import { tools } from '@/constants'
import { Card } from './ui/card'
import { cn } from '@/lib/utils'
import { Check, Zap } from 'lucide-react'
import { Button } from './ui/button'
import axios from 'axios'
import toast from 'react-hot-toast'

const ProModal = () => {
  const proModal = useProModal();
  const [loading, setLoading] = useState(false);

  const onSubscribe = async () => {
    try {
      setLoading(true);

      const res = await axios.get('/api/stripe');

      window.location.href = res.data.url;
    } catch {
      toast.error('Something went wrong');
    } finally {
      setLoading(false);
    }
  }

  return (
    <Dialog open={proModal.isOpen} onOpenChange={proModal.onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className='flex justify-center items-center flex-row font-bold gap-x-2 py-1 gap-y-4 pb-2'>
              Upgrade to aiPower
              <Badge className='uppercase text-sm py-1' variant="premium">
                pro
              </Badge>
          </DialogTitle>

          <DialogDescription asChild>
            <div className='text-center pt-2 space-y-2 text-zinc-900 font-medium overflow-y-auto'>
              {tools.map(({ label, bgColor, color, icon: Icon }) => (
                <Card key={label} className='p-3 border-black/5 flex flex-row items-center justify-between'>
                  <div className='flex items-center gap-x-4'>
                    <div className={cn(
                      'p-2 w-fit rounded-md',
                      bgColor
                    )}>
                      <Icon className={cn(
                        'w-6 h-6',
                        color
                      )} />
                    </div>
                    <div className='font-semibold text-sm'>
                      {label}
                    </div>
                  </div>
                  <Check className='text-primary w-5 h-5' />
                </Card>
              ))}
            </div>
          </DialogDescription>
        </DialogHeader>

        <DialogFooter>
          <Button 
            size='lg' 
            className='w-full cursor-pointer' 
            variant='premium'
            onClick={onSubscribe}
            disabled={loading}
          >
            Upgrade
            <Zap className='w-4 h-4 ml-2 fill-white' />
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

export default ProModal
