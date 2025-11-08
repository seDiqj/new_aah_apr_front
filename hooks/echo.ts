"use client";

import { useEffect, useState } from 'react';
import Echo from 'laravel-echo';
import Pusher from 'pusher-js';
import { useParentContext } from '@/contexts/ParentContext';

const useEcho = (): Echo<any> | null => {
  const { axiosInstance } = useParentContext();
  const [echoInstance, setEchoInstance] = useState<Echo<any> | null>(null);

  useEffect(() => {
    if (typeof window !== "undefined") {
      (window as any).Pusher = Pusher;

      const echo = new Echo({
        broadcaster: 'reverb',
        key: 'urpqqo9fiajubq433jcx',
        authorizer: (channel: any) => {
          return {
            authorize: (socketId: string, callback: (error: Error | null, data?: any) => void) => {
              axiosInstance
                .post('/broadcasting/auth', {
                  socket_id: socketId,
                  channel_name: channel.name,
                })
                .then((response: any) => callback(null, response.data))
                .catch((error: any) => callback(error instanceof Error ? error : new Error(String(error))));
            },
          };
        },
        wsHost: 'localhost',
        wsPort: 8080,
        wssPort: 8080,
        forceTLS: false,
        enabledTransports: ['ws', 'wss'],
      });

      setEchoInstance(echo);
    }
  }, []);

  return echoInstance;
};

export default useEcho;
