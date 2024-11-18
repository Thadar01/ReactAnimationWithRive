import { useEffect, useState } from 'react';
import { Layout, useRive,useStateMachineInput } from "@rive-app/react-canvas";
import "./Toy.css";

const RoadMap = () => {
  // State to keep track of the input value
  const [scrollValue, setScrollValue] = useState(0);

  const { RiveComponent,rive } = useRive({
    src: "/scroll.riv",
    artboard: "RoadMapArtboard",
    stateMachines: "State Machine 1",
    autoplay: true,
    // layout: new Layout({
    //    alignment: 'center'
    // })
  });
  const number = useStateMachineInput(rive, "State Machine 1", "Number 1");

  useEffect(() => {
    const handleScroll = (event) => {
      // Calculate scroll delta based on scroll direction
      const scrollAmount = window.scrollY;
      console.log(scrollAmount)
      setScrollValue(scrollAmount)
      // setScrollValue((prevValue) => prevValue + (scrollAmount - prevValue) * 0.1); // Control sensitivity with the multiplier (0.1 in this case)
    };
    if(number){    number.value=scrollValue
    }
    // Attach the scroll event listener
    window.addEventListener('scroll', handleScroll);

    // Clean up the event listener on component unmount
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [scrollValue]);

  return (
    <div className='element'>
    <div style={{ width: '1000px', height: '700px',position:'fixed' }}>
      <RiveComponent style={{ width: '100%', height: '100%' }} />
     
    </div>
    </div>
  );
};

export default RoadMap;
