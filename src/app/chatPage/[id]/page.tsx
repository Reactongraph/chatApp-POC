"use client"
import React, { useEffect, useState, useRef} from 'react';
import supabase from '../../../config/supabaseClient';

interface RealtimeEvent {
  table: string;
  type: string;
  new: any; // Adjust the type based on the actual structure of the 'new' property
} 

interface ChatPageProps {
  params: {
    id: string;
  };
}

const ChatPage: React.FC<ChatPageProps> = ({ params }) => {
  // const [userId, setUserId] = useState<number | undefined>();
  const receiverId = parseInt(params.id);
  const [fetchError, setFetchError] = useState<string | null>(null);;
  const [messages, setMessages] =  useState<any[]>([]);
  const [message, setMessage] = useState('');
  const userIdRef = useRef<number | null>(null);

const fetchMessages = async () => {
         if (typeof window !== 'undefined' && window.localStorage) {
      let storedUserId = localStorage.getItem("senderId");

      // Check if storedUserId is not null or undefined before parsing
      if (storedUserId !== null && storedUserId !== undefined) {
         userIdRef.current = parseInt(storedUserId, 10);
        //  setUserId(parseInt(storedUserId, 10))
      }
    }

    const { data, error } = await supabase
      .from('SupabaseMessages')
      .select('*')
      .or(`and(senderId.eq.${userIdRef.current},receiverId.eq.${receiverId}),and(senderId.eq.${receiverId},receiverId.eq.${userIdRef.current})`) 
      .order('created_at', { ascending: true });
   console.log(data)
    if (error){
        console.log(error)
      setFetchError(error.message);
    } else {
        console.log("data")
      setMessages(data);
    }
  };

  const handleSubscription = (event: RealtimeEvent) => {
    // Check if the new message already exists in the messages state
  const isNewMessageExist = messages.some((msg) => msg.id === event.new.id);
   
  // If the new message doesn't exist, add it to the messages state
  if (!isNewMessageExist ) {
    setMessages((prevMessages) => [...prevMessages, event.new]);
  }
  };
  
  useEffect(() => {
    fetchMessages();
   const subscription = supabase
  .channel('RealtimeSubscription')
  .on('postgres_changes' as any, { event: 'INSERT', schema: 'public', table: 'SupabaseMessages' }, handleSubscription)
  .subscribe();
  // Clean up subscription on component unmount
    return () => {
      subscription.unsubscribe();
    };
  }, [receiverId]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // Check if the message is not empty before inserting
    if (message.trim().length !== 0) {
      const { error, data } = await supabase
        .from('SupabaseMessages')
        .insert([{ senderId: userIdRef.current, receiverId, content: message }]);

      if (error) {
        console.error('Error sending message:', error.message);
      } else {
        // Clear the input field after sending the message
        setMessage('');
     }
    }
  };

  return (
    <div>
      <div className="page home">
        <div>
          {/* Display messages */}
          <div>
            {messages.map((msg) => (
              <div key={msg.id}>
                <p>{msg.senderId === userIdRef.current ? `You: ${userIdRef.current} ` : `User ${msg.senderId}: `}{msg.content}</p>
                {/* You can display additional information like timestamp, etc. */}
              </div>
            ))}
          </div>

          {/* Input field for message */}
          <form onSubmit={handleSubmit}>
            <input
              className="border-2"
              type="text"
              name="message"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
            />
            {/* Button to trigger message insertion */}
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


