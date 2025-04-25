import React from 'react'

const SaveButton = ({
    saveAnimation
}) => {
  return (
    <div className="mt-5 p-4 w-full max-w-[90rem] -z-10 flex justify-end items-center text-white absolute bottom-0 left-[50%] translate-x-[-50%]">
    <button
      onClick={saveAnimation}
      className="text-green-400 hover:text-green-600 border-1 px-2.5 py-1 rounded-xl"
    >
      <i className="ri-save-line"></i> Save
    </button>
  </div>
  )
}

export default SaveButton