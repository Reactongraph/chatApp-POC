"use client"
import supabase from '../config/supabaseClient'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'

const Home = () => {

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

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setUserId(event.target.value)
  }

  const handleSearchClick = () => {
     if(userId !== ""){
      localStorage.setItem("senderId", userId.toString());
    fetchUsers()
    }
  }
 
  const  handleChat = (id: any) => {
  router.push(`/chatPage/${id}`)
 }

  return (
    <div>
      <div className="page home">
        <div>
          {/* Input field for user ID */}
          <label>
            User ID:
            <input className="border-2" type="text" value={userId} onChange={handleInputChange} />
          </label>
          {/* Button to trigger user search */}
          <button onClick={handleSearchClick} className='bg-black text-white'>Search</button>
        </div>
        <h2>Users available for chat</h2>
        {fetchError && <p>{fetchError}</p>}
        {users && (
          <div className="users flex flex-col">
            {users.map((user) => (
              <button style={{all:"unset"}} key={user.id} onClick={()=>{handleChat(user.id)}}>{user.Users}</button>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
export default Home

