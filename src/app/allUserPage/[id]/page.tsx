"use client"
import supabase from '../../../config/supabaseClient'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'

interface allUserPageProps {
  params: {
    id: string;
  
  };
}
const Page:React.FC<allUserPageProps>= ({ params }) => {

  const router = useRouter();
  const [fetchError, setFetchError] =  useState<string | null>(null);
  const [users, setUsers] = useState<any[] | null>(null);
  
  const userId = parseInt(params.id);
  

  const fetchUsers = async () => {
    
    try {
  
       // First, check if the user with the entered ID exists
    const { data: userExistsData, error: userExistsError } = await supabase
      .from('Supabase')
      .select('id')
      .eq('id', userId);
      
    if (userExistsError) {
      console.log("user is not exist with id")
      setFetchError('Could not check user existence');
      setUsers(null);
      return;
    }
       if(userExistsData.length === 0){
        console.log("user is not present with this id")
       }
    // If user with entered ID exists, fetch other users
    if (userExistsData && userExistsData.length > 0) {
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
          <div>
            {users.map((user) => (
              <button className="flex h-8 w-20 items-center justify-center gap-y-2 rounded-[4px] bg-green-200 ml-2 flex-col mt-2" key={user.id} onClick={()=>{handleChat(user.id)}}>{user.Users}</button>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
export default Page