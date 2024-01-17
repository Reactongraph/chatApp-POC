"use client"
import supabase from '../../config/supabaseClient'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'

const Page = () => {

  const router = useRouter();
  const [fetchError, setFetchError] =  useState<string | null>(null);
  const [users, setUsers] = useState<any[] | null>(null);
  const [userId, setUserId] = useState<string>(''); // State to store the user ID input

  const fetchUsers = async () => {
    try {
      const { data, error } = await supabase
        .from('Supabase')
        .select()
        .neq('id', userId) // Assuming 'id' is the column name for user IDs
      if (error) {
        setFetchError('Could not fetch the users')
        setUsers(null)
      } else {
        setUsers(data)
        setFetchError(null)
      }
    } catch (error: any) {
      console.error('Error fetching users:', error.message)
      setFetchError('An error occurred while fetching users')
      setUsers(null)
    }
  }

  useEffect(() => {
    // Fetch users when the component mounts
    fetchUsers()
  }, []) // eslint-disable-line react-hooks/exhaustive-deps



 
  const  handleChat = (id: any) => {
  router.push(`/chatPage/${id}`)
 }

  return (
    <div>
      <div className="page home">
        <h2>Users available for chat</h2>
        {fetchError && <p>{fetchError}</p>}
        {users && (
          <div className="users flex flex-col cursor-pointer">
            {users.map((user) => (
              <button style={{all:"unset"}} key={user.id} onClick={()=>{handleChat(user.id)}}>{user.Users}</button>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
export default Page

// import React, { useEffect, useState, useRef } from 'react';
// import supabase from '../../../config/supabaseClient';

// interface RealtimeEvent {
//   table: string;
//   type: string;
//   new: any; // Adjust the type based on the actual structure of the 'new' property
// }

// interface ChatPageProps {
//   params: {
//     id: string;
//   };
// }

// const ChatPage: React.FC<ChatPageProps> = ({ params }) => {
//   const receiverId = parseInt(params.id);
//   const [fetchError, setFetchError] = useState<string | null>(null);
//   const [messages, setMessages] = useState<any[]>([]);
//   const [message, setMessage] = useState('');
//   const userIdRef = useRef<number | null>(null);

//   const fetchMessages = async () => {
//     if (typeof window !== 'undefined' && window.localStorage) {
//       let storedUserId = localStorage.getItem('senderId');

//       if (storedUserId) {
//         userIdRef.current = parseInt(storedUserId, 10);
//       }
//     }

//     try {
//       const { data, error } = await supabase
//         .from('SupabaseMessages')
//         .select('*')
//         .or(`and(senderId.eq.${userIdRef.current},receiverId.eq.${receiverId}),and(senderId.eq.${receiverId},receiverId.eq.${userIdRef.current})`)
//         .order('created_at', { ascending: true });

//       if (error) {
//         console.error(error);
//         setFetchError(error.message);
//       } else {
//         setMessages(data || []);
//         // Mark received messages as read
//         markMessagesAsRead(data);
//       }
//     } catch (error) {
//       console.error(error);
//       setFetchError(error.message);
//     }
//   };

//   const markMessagesAsRead = async (messagesToMarkAsRead) => {
//     const unreadMessages = messagesToMarkAsRead.filter((msg) => msg.senderId === receiverId && !msg.isRead);

//     if (unreadMessages.length > 0) {
//       const messageIds = unreadMessages.map((msg) => msg.id);

//       try {
//         await supabase
//           .from('SupabaseMessages')
//           .update({ isRead: true })
//           .in('id', messageIds);
//       } catch (error) {
//         console.error('Error marking messages as read:', error.message);
//       }
//     }
//   };

//   const handleSubscription = (event: RealtimeEvent) => {
//     const isNewMessageExist = messages.some((msg) => msg.id === event.new.id);
//     const isMessageForReceiver =
//       (event.new.senderId === userIdRef.current && event.new.receiverId === receiverId) ||
//       (event.new.senderId === receiverId && event.new.receiverId === userIdRef.current);

//     if (!isNewMessageExist && isMessageForReceiver) {
//       setMessages((prevMessages) => [...prevMessages, event.new]);
//     }
//   };

//   useEffect(() => {
//     fetchMessages();

//     const subscription = supabase
//       .channel('RealtimeSubscription')
//       .on('postgres_changes' as any, { event: 'INSERT', schema: 'public', table: 'SupabaseMessages' }, handleSubscription)
//       .subscribe();

//     return () => {
//       subscription.unsubscribe();
//     };
//   }, [receiverId]);

//   const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
//     e.preventDefault();

//     if (message.trim().length !== 0) {
//       try {
//         await supabase
//           .from('SupabaseMessages')
//           .insert([{ senderId: userIdRef.current, receiverId, content: message, isRead: false }]);

//         setMessage('');
//       } catch (error) {
//         console.error('Error sending message:', error.message);
//       }
//     }
//   };

//   return (
//     <div>
//       <div className="page home">
//         <div>
//           <div>
//             {messages.map((msg) => (
//               <div
//                 key={msg.id}
//                 className={`${msg.senderId === userIdRef.current ? 'text-right' : 'text-left'} w-[15rem]`}
//               >
//                 <p>
//                   {msg.senderId === userIdRef.current
//                     ? `You: ${userIdRef.current} `
//                     : `User ${msg.senderId}: `}
//                   {msg.content}
//                   {msg.isRead ? ' (Read)' : ' (Unread)'}
//                 </p>
//               </div>
//             ))}
//           </div>

//           <form onSubmit={handleSubmit}>
//             <input
//               className="border-2"
//               type="text"
//               name="message"
//               value={message}
//               onChange={(e) => setMessage(e.target.value)}
//             />
//             <button type="submit" className="bg-black text-white">
//               Send Message
//             </button>
//           </form>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default ChatPage;
