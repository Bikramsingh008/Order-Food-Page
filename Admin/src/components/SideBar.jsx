import React from 'react'
import { NavLink } from 'react-router-dom'
import { assets } from '../assets/assets'

const SideBar = () => {
  return (
    <div className='w-full md:w-[20%] border-b-2 md:border-b-0 md:border-r-2 bg-white md:bg-transparent'>
      <div className='flex flex-row md:flex-col gap-2 md:gap-4 p-3 md:pt-6 md:pl-[15%] text-sm sm:text-base overflow-x-auto justify-around md:justify-start'>
        <NavLink className='flex items-center gap-2 md:gap-3 border border-gray-300 px-3 py-2 rounded.md md:rounded-l md:border-r-0 min-h-[44px] min-w-[100px] justify-center md:justify-start' to="/add">
          <img className='w-5 h-5' src={assets.add_icon} alt=''/>
          <p className='font-semibold text-xs sm:text-sm md:text-base'>Add Items</p>
        </NavLink>

        <NavLink className='flex items-center gap-2 md:gap-3 border border-gray-300 px-3 py-2 rounded-md md:rounded-l md:border-r-0 min-h-[44px] min-w-[100px] justify-center md:justify-start' to="/list">
          <img className='w-5 h-5' src={assets.order_icon} alt=''/>
          <p className='font-semibold text-xs sm:text-sm md:text-base'>List Items</p>
        </NavLink>

        <NavLink className='flex items-center gap-2 md:gap-3 border border-gray-300 px-3 py-2 rounded-md md:rounded-l md:border-r-0 min-h-[44px] min-w-[100px] justify-center md:justify-start' to="/orders">
          <img className='w-5 h-5' src={assets.order_icon} alt=''/>
          <p className='font-semibold text-xs sm:text-sm md:text-base'>Orders</p>
        </NavLink>
      </div>
    </div>
  )
}

export default SideBar
