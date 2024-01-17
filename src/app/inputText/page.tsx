"use client"
import supabase from '../../config/supabaseClient'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'

const Home = () => {

  const router = useRouter();

  const [userId, setUserId] = useState<string>(''); // State to store the user ID input




  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setUserId(event.target.value)
  }

  const handleSearchClick = () => {
     if(userId !== ""){
      localStorage.setItem("senderId", userId.toString());
      router.push(`/allUsers`)
   }
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

      </div>
    </div>
  )
}
export default Home

