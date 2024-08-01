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

{/* <div className='bg-white h-80 border rounded shadow  p-4'>
            <div className='w-full h-32 bg-cat1 bg-cover rounded bg-no-repeat bg-right'></div>
            <div className='w-full py-6 text-xl font-bold flex items-center justify-center'>{cat.categoryName}</div>

            <div className='w-full flex items-center justify-center'>
              <div className='w-24 h-auto flex flex-col items-center justify-center border-r border-gray-300 text-sm'>
                <button className='font text-lg font-medium px-4'>3</button>Toplam Hikaye
              </div>

              <div className='w-24 h-auto flex flex-col items-center justify-center text-sm'>
                <button className='font text-lg font-medium px-4'>200</button>Yazar
              </div>
            </div>

            <div className='w-full py-2 flex items-center justify-center'>
              <div className='px-4 py-1 rounded-full bg-[#7469b6] text-white text-xs font-medium'>Popüler</div>
            </div>
          </div> */}