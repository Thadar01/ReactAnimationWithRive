import { useEffect, useState } from 'react';
import { useRive, useStateMachineInput } from "@rive-app/react-canvas";
import "./Toy.css";

const RoadMap = () => {
  // State to keep track of the scroll value
  const [scrollValue, setScrollValue] = useState(0);

  const { RiveComponent, rive } = useRive({
    src: "/scroll.riv",
    artboard: "Artboard",
    stateMachines: "State Machine 3",
    autoplay: true,
  });

  const number = useStateMachineInput(rive, "State Machine 3", "scrollPath");
  const data=['1','2','3','4','5','6','7','8','9','10'];
  const data2=['11','12','13','14','15','16','17','18','19','20'];
 
  const run=['oneRun','twoRun','threeRun','fourRun','fiveRun','sixRun','sevenRun','eightRun','nineRun','tenRun']
  useEffect(() => {
    const handleScroll = () => {
      const scrollAmount = window.scrollY;
      console.log(scrollAmount)

      const maxRange = 200; 
      const wrappedValue = (scrollAmount % maxRange + maxRange) % maxRange; 

      setScrollValue(wrappedValue);
    };

    window.addEventListener('scroll', handleScroll);
    if (number) {
      number.value = scrollValue;
    }
    if(rive){ 
      if(window.scrollY<200){
        for (let i = 0; i < data.length; i++) {
          rive.setTextRunValue(run[i], data[i]);
      }
   

    }
      else{
        for (let i = 0; i < data2.length; i++) {
          rive.setTextRunValue(run[i], data2[i]);
      }
      }
  }
    return () => window.removeEventListener('scroll', handleScroll);

   
   
  }, [scrollValue,number,rive]);



  return (
    <div className='element'>
      <div style={{ width: '1000px', height: '500px', position: 'fixed', marginTop: '10px' }}>
        <RiveComponent style={{ width: '100%', height: '100%' }} />
      </div>
    </div>
  );
};

export default RoadMap;
