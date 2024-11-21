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
const complete2=useStateMachineInput(rive, "State Machine 4", "complete2");
const complete3=useStateMachineInput(rive, "State Machine 4", "complete3");
const complete4=useStateMachineInput(rive, "State Machine 4", "complete4");
const group1=useStateMachineInput(rive, "State Machine 4", "group1");
const group2=useStateMachineInput(rive, "State Machine 4", "group2");
const group3=useStateMachineInput(rive, "State Machine 4", "group3");
const group4=useStateMachineInput(rive, "State Machine 4", "group4");


  useEffect(() => {
    if (rive && complete1 && complete2 && complete3 && complete4 &&group1 &&group2 && group3 && group4) {

      const groups = [group1, group2, group3, group4];

      for (let i = 0; i < data.length; i++) {
        if (groups[i]) groups[i].value = true;
      }
            for (let i = 0; i < data.length; i++) {
        rive.setTextRunValue(run[i], data[i].unit);
        const filterComplete = data.filter(item => item.status === "complete");
        for(let j=0; j< filterComplete.length; j++){
         if(data[0]&&filterComplete[j].unit===data[0].unit){
          complete1.value=true
         }
         if(data[1]&&filterComplete[j].unit===data[1].unit){
          complete2.value=true
         }
         if(data[2]&&filterComplete[j].unit===data[2].unit){
          complete3.value=true
         }
         if(data[3]&&filterComplete[j].unit===data[3].unit){
          complete4.value=true
         }
        }
       
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
  }, [rive, data, run,complete1,complete2,complete3,complete4,group1,group2,group3,group4]);

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
    { unit: '5', status: 'not complete' },
    { unit: '6', status: 'not complete' },
    // { unit: '7', status: 'not complete' },
    // { unit: '8', status: 'not complete' },
    // { unit: '9', status: 'not complete' },
    // { unit: '10', status: 'not complete' },
    // { unit: '11', status: 'complete' },
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
