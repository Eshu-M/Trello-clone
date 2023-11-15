'use client'
import Image from 'next/image'
import { MagnifyingGlassIcon ,UserCircleIcon} from '@heroicons/react/24/solid'
import Avatar from 'react-avatar'
import { useBoardStore } from '@/store/BoardStore'

function Header() {
    const [searchString , setSearchString]=useBoardStore((state)=>[
        state.searchString,
        state.setSearchString,
    ])
  return (
    <header>
        <div className="flex flex-col md:flex-row items-center p-5 bg-gray-500/10 rounded-b-2xl">
            {/* Using a blur gradiant on the background*/}
            <div className='absolute top-0 left-0 w-full h-96 bg-gradient-to-br 
            from-pink-400  to-[#42D681] rounded-md filter blur-3xl opacity-50 -z-50'/>
           <Image src={'https://links.papareact.com/c2cdd5'} alt='Trello Logo' width={300} height={100}
           className='w-44 md:w-56 pb-10 md:pb-0 object-contain'/>
           <div className='flex items-center space-x-5 flex-1 justify-end w-full'>
               {/* Search Box */}
               <form className='flex items-center space-x-5 bg-white rounded-md p-2 shadow-md flex-1 md:flex-initial'>
                   <MagnifyingGlassIcon className='h-6 w-6 text-grey-400'/>
                  <input type="text" 
                   placeholder='Search'
                   value={searchString}
                   onChange={(e)=>setSearchString(e.target.value)}
                   className='flex-1 outline-none p-2'/>
                  <button hidden type='submit'>Search</button>
               </form>
               {/* Avatar */}
               <Avatar name='Esham Mubarek' round color='#229860' size='50'/>
           </div>
        </div>
        <div className='flex items-center justify-center py-2 px-5 md:py-5'>
            <p className='flex items-center text-sm font-light p-5 shadow-xl rounded-xl w-fit bg-white italic max-w-3xl text-[#388AB6]'>
                <UserCircleIcon className='inline-block h-10 w-10 text-[#229860]'/>
                Gpt is summarizing your tasks for the day.....
            </p>
        </div>
    </header>
  )
}

export default Header