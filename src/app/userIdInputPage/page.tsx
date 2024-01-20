"use client"
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'

const page = () => {

  const router = useRouter();
 const [userId, setUserId] = useState<string>(''); // State to store the user ID input

 

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setUserId(event.target.value)
  }

  const handleSubmit = () => {
     if(userId !== ""){
      localStorage.setItem("senderId", userId.toString());
    router.push(`allUserPage/${userId}`)
    }
  }
 
return (
    <div>
      <div className="page home ml-2">
        <div className='my-5'>
         <label>
            User ID:
            <input className="border-2 rounded-xl" type="text" value={userId} onChange={handleInputChange} />
          </label>
         
          <button onClick={handleSubmit} className='bg-black w-20 rounded-[4px] text-white'>Submit</button>
        </div>
       
        
        
 </div>
    </div>
  )
}
export default page