"use client"
import React, { useEffect, useState, useRef } from 'react';
import supabase from '../../../config/supabaseClient';

interface RealtimeEvent {
  table: string;
  type: string;
  new: any;
}

interface ChatPageProps {
  params: {
    id: string;
  
  };
}

const ChatPage: React.FC<ChatPageProps> = ({ params }) => {
  console.log(params)
  const receiverId = parseInt(params.id);
  const [fetchError, setFetchError] = useState<string | null>(null);
  const [messages, setMessages] = useState<any[]>([]);
  const [message, setMessage] = useState('');
  const userIdRef = useRef<number | null>(null);


const fetchMessages = async () => {
    if (typeof window !== 'undefined' && window.localStorage) {
      let storedUserId = localStorage.getItem('senderId');

      if (storedUserId) {
        userIdRef.current = parseInt(storedUserId, 10);
        
      }
    }

    try {
      const { data, error } = await supabase
        .from('SupabaseMessages')
        .select('*')
        .or(`and(senderId.eq.${userIdRef.current},receiverId.eq.${receiverId}),and(senderId.eq.${receiverId},receiverId.eq.${userIdRef.current})`)
        .order('created_at', { ascending: true });

      if (error) {
        console.error(error);
        setFetchError(error.message);
      } else {
        setMessages(data || []);
        // Mark received messages as read
        markMessagesAsRead(data);
      }
    } catch (error: any) {
      console.error(error);
      setFetchError(error.message);
    }
  };

  const markMessagesAsRead = async (messagesToMarkAsRead: any) => {
 
    const unreadMessages = messagesToMarkAsRead.filter((msg: any) => msg.receiverId === userIdRef.current && !msg.isRead);
  
    if (unreadMessages.length > 0) {
   
      const messageIds = unreadMessages.map((msg: any) => msg.id);
  
  
      try {
        await supabase
          .from('SupabaseMessages')
          .update({ isRead: true })
          .in('id', messageIds);
      } catch (error: any) {
        console.error('Error marking messages as read:', error.message);
      }
    }
  };

  const handleSubscription = (event: RealtimeEvent) => {
    const isNewMessageExist = messages.some((msg) => msg.id === event.new.id);
    const isMessageForReceiver =
      (event.new.senderId === userIdRef.current && event.new.receiverId === receiverId) ||
      (event.new.senderId === receiverId && event.new.receiverId === userIdRef.current);
    
      const newMessage = [event.new];
     
      if(event.new.senderId === receiverId){
         markMessagesAsRead(newMessage)
      }
  
   
    if (!isNewMessageExist && isMessageForReceiver && event.eventType === 'INSERT') {
      // Insert new message into the state
      setMessages((prevMessages) => [...prevMessages, event.new]);
    } else if (isMessageForReceiver && event.eventType === 'UPDATE') {
      
      // Update existing message in the state
      setMessages((prevMessages) =>
        prevMessages.map((msg) => (msg.id === event.new.id ? { ...msg, isRead: event.new.isRead } : msg))
       );
  };
}

  useEffect(() => {
    fetchMessages();
    const subscription = supabase
      .channel('RealtimeSubscription')
      .on('postgres_changes' as any, { event: '*', schema: 'public', table: 'SupabaseMessages' }, handleSubscription)
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  }, [receiverId]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (message.trim().length !== 0) {
      try {
        await supabase
          .from('SupabaseMessages')
          .insert([{ senderId: userIdRef.current, receiverId, content: message }]);
        setMessage('');
      } catch (error: any) {
        console.error('Error sending message:', error.message);
      }
    }
  };

  return (
    <div>
      <div className="page home">
        <div>
          <div>
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`${msg.senderId === userIdRef.current ? 'text-right' : 'text-left'} w-[15rem]`}
              >
          <p>
                  {msg.senderId === userIdRef.current
                    ? `You: ${userIdRef.current} ${msg.isRead ? '(Read)' : '(Unread)'}`
                    : `User ${msg.senderId}: ` }
                  {msg.content}
                  
                </p>
              </div>
            ))}
          </div>

          <form onSubmit={handleSubmit}>
            <input
              className="border-2"
              type="text"
              name="message"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
            />
            <button type="submit" className="bg-black text-white">
              Send Message
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
export default ChatPage;