import React, { useEffect } from 'react'

function Interactions() {

  useEffect(() => {
    console.log("hello")
  }, []);
  return (
    <div>Interactions</div>
  )
}

export default Interactions