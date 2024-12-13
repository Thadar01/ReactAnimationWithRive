import React, { useState, useEffect } from 'react';
import { RuntimeLoader, useRive } from '@rive-app/react-canvas';
export const Game = () => {
  const [number, setNumber] = useState(0);

  const {rive, RiveComponent,artboard} = useRive({
    src: "/game.riv",
    artboard: "Artboard",
    stateMachines: "State Machine 1",
    autoplay: true,
   
  });

  const getPosition = () => {
    // Replace 'objectName' with the name of your Rive object
    if(rive && rive.activeArtboard){
        const artboard=rive.activeArtboard
        console.log(artboard.component('A'))
     
    }
   
  };

  const handleKeyDown = (event) => {
    switch (event.key) {
      case 'ArrowUp':
        setNumber((prevNumber) => prevNumber + 1); // Use the functional update form
        break;
      case 'ArrowDown':
        setNumber((prevNumber) => prevNumber - 1); // Use the functional update form
        break;
      default:
        break; // Do nothing for other keys
    }
  };

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);

 
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  useEffect(()=>{
    if(artboard){
        // getPosition()
        console.log(artboard)
    }
  },[artboard])

  return (
    <>
    <div style={{width:'1000px',height:'700px'}}>
        <RiveComponent/>
    </div>
    <button onClick={getPosition}>Get Object Position</button>
    </>
  )
};
