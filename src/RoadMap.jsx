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
    onStateChange:(event)=>{
      console.log(event.data)
    }
  });

  const number = useStateMachineInput(rive, "State Machine 3", "scrollPath");
  const data=['1','2','3','4','5','6','7','8','9','10','11','12','13','14','15','16','17','18','19','20','21','22','23','24','25','26','27','28','29','30']

  function splitMainData(data, size = 10) {
    const result = [];
    for (let i = 0; i < data.length; i += size) {
      result.push(data.slice(i, i + size));
    }
    return result;
  }

  const run=['oneRun','twoRun','threeRun','fourRun','fiveRun','sixRun','sevenRun','eightRun','nineRun','tenRun']
  
  useEffect(() => {
    const splitData=splitMainData(data);

    const handleScroll = () => {
      const scrollAmount = window.scrollY;

      const maxRange = 200; 
      const wrappedValue = (scrollAmount % maxRange + maxRange) % maxRange; 

      setScrollValue(wrappedValue);
    };

    window.addEventListener('scroll', handleScroll);
    if (number) {
      number.value = scrollValue;
    }
    // console.log("Y",window.scrollY)
    if(rive){ 

      if(window.scrollY>200){
        const index=Math.floor(window.scrollY/200)
        // console.log('index',index)
        if(index<splitData.length){
          for (let i = 0; i < splitData[index].length; i++) {
            rive.setTextRunValue(run[i], splitData[index][i]);
        }
        }
 
        
      }else{
        for (let i = 0; i < splitData[0].length; i++) {
          rive.setTextRunValue(run[i], splitData[0][i] );
      }
      }

      rive.on('statechange',(event)=>{
        const click = event.data.find(item => item === 'click');
        if(click){
          return true
        }
      
      })
  
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
