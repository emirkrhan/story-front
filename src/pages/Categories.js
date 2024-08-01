import React from 'react'
import Navbar from '../components/Navbar'
import categories from '../components/Categories';

function Categories() {
  return (
    <div className='w-full min-h-screen h-auto bg-[#eeeff0] flex z-0'>
      <Navbar />
      <div className='w-full h-screen p-32 pt-24 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4'>
        {categories.map((cat) => (
          <a href={`/category/${cat.id}`} className='bg-white h-48 cat-box bg-cat1 bg-cover bg-no-repeat bg-right border rounded-lg shadow p-4 flex items-end justify-start'>
            <p className='text-xl font-bold text-white mr-4'>{cat.categoryName}</p>
              <div className='px-4 py-1 rounded-full bg-white text-black text-xs font-semibold'>Popüler</div>
          </a>
        ))}
      </div>
    </div>
  )
}

export default Categories