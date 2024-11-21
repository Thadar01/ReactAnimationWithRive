import { useEffect } from 'react';
import { useRive,useStateMachineInput } from "@rive-app/react-canvas";
import "./Toy.css";

const RiveComponentWrapper = ({ index, run, data }) => {
  const { RiveComponent, rive } = useRive({
    src: "/scroll.riv",
    artboard: "MapArtboard",
    stateMachines: "State Machine 4",
    autoplay: true,
    onStateChange: (event) => {
      console.log(event.data); // log the state change data
    }
  });
const complete1=useStateMachineInput(rive, "State Machine 4", "complete1");


  useEffect(() => {
    if (rive) {
      // Set initial text values for each run
      for (let i = 0; i < data.length; i++) {
        rive.setTextRunValue(run[i], data[i].unit);
        if (data[i].status === "complete") {
          console.log('Status is complete for:', data[i].unit);
        }
      }
      if(complete1){
        console.log("it is complete1")
      }
      const buttonMapping = {
        click1: 0,
        click2: 1,
        click3: 2,
        click4: 3
      };

      rive.on('statechange', (event) => {
        const buttonIndex = buttonMapping[event.data[0]];

        if (buttonIndex !== undefined) {
          console.log(data[buttonIndex].unit); 
        }
      });
    }
  }, [rive, data, run]);

  return (
    <div className="rive-container">
      <RiveComponent style={{ width: '100%', height: '100%' }} />
    </div>
  );
};

const Map = () => {
  const data = [
    { unit: '1', status: 'complete' },
    { unit: '2', status: 'complete' },
    { unit: '3', status: 'complete' },
    { unit: '4', status: 'not complete' },
    { unit: '5', status: 'complete' },
    { unit: '6', status: 'complete' },
    { unit: '7', status: 'not complete' },
    { unit: '8', status: 'not complete' },
    { unit: '9', status: 'not complete' },
    { unit: '10', status: 'not complete' },
    { unit: '11', status: 'not complete' },
    { unit: '12', status: 'not complete' },
    { unit: '13', status: 'not complete' },
    { unit: '14', status: 'not complete' },
    { unit: '15', status: 'not complete' },
    { unit: '16', status: 'not complete' }
  ]
  

  function splitMainData(data, size = 4) {
    const result = [];
    for (let i = 0; i < data.length; i += size) {
      result.push(data.slice(i, i + size));
    }
    return result;
  }

  const splitData = splitMainData(data);

  const run = ['oneRun', 'twoRun', 'threeRun', 'fourRun'];

  return (
    <div className="element">
      {splitData.map((chunk, index) => (
        <RiveComponentWrapper key={index} index={index} run={run} data={chunk} />
      ))}
    </div>
  );
};

export default Map;
