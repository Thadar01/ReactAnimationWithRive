import { useEffect, useState, useCallback } from 'react';
import { useRive, useStateMachineInput } from "@rive-app/react-canvas";
import "./Toy.css";

const InfiniteScroll = () => {
  // State to keep track of the input value
  const [scrollValue, setScrollValue] = useState(0);

  const { RiveComponent, rive } = useRive({
    src: "/scroll.riv",
    artboard: "Artboard",
    stateMachines: "State Machine 1",
    autoplay: true,
  });

  // Access the state machine input for controlling blend
  const number = useStateMachineInput(rive, "State Machine 1", "Number 1");

  // Update scroll handler with useCallback to ensure consistent function reference
  const handleScroll = useCallback(() => {
    const scrollAmount = window.scrollY;
    setScrollValue(scrollAmount); // Update state
  }, []);

  useEffect(() => {
    // Attach the scroll event listener
    window.addEventListener('scroll', handleScroll);

    // Clean up the event listener on component unmount
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [handleScroll]);

  // Update Rive input whenever scrollValue changes
  useEffect(() => {
    if (number && rive) {
      // Normalize or wrap the scrollValue as needed (for infinite effect)
      number.value = scrollValue % 200; // Adjust modulus based on your needs
    }
  }, [scrollValue, number, rive]);

  return (
    <div className='element'>
      <div style={{ width: '3000px', height: '500px', position: 'fixed', marginTop: '10px' }}>
        <RiveComponent style={{ width: '100%', height: '100%' }} />
      </div>
    </div>
  );
};

export default InfiniteScroll;
