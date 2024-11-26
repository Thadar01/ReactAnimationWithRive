import { useEffect, useRef } from "react";
import { useRive, useStateMachineInput } from "@rive-app/react-canvas";
import "./map.css";

const RiveComponentWrapper = ({ index, run, data, innerRef }) => {
  const { RiveComponent, rive } = useRive({
    src: "/scroll.riv",
    artboard: "MapArtboard",
    stateMachines: "State Machine 4",
    autoplay: true,
    // onStateChange: (event) => {
    //   console.log(event.data); // log the state change data
    // },
  });
  const complete1 = useStateMachineInput(rive, "State Machine 4", "complete1");
  const complete2 = useStateMachineInput(rive, "State Machine 4", "complete2");
  const complete3 = useStateMachineInput(rive, "State Machine 4", "complete3");
  const complete4 = useStateMachineInput(rive, "State Machine 4", "complete4");
  const group1 = useStateMachineInput(rive, "State Machine 4", "group1");
  const group2 = useStateMachineInput(rive, "State Machine 4", "group2");
  const group3 = useStateMachineInput(rive, "State Machine 4", "group3");
  const group4 = useStateMachineInput(rive, "State Machine 4", "group4");
  const current1 = useStateMachineInput(rive, "State Machine 4", "current1");
  const current2 = useStateMachineInput(rive, "State Machine 4", "current2");
  const current3 = useStateMachineInput(rive, "State Machine 4", "current3");
  const current4 = useStateMachineInput(rive, "State Machine 4", "current4");

  useEffect(() => {
    if (
      rive &&
      complete1 &&
      complete2 &&
      complete3 &&
      complete4 &&
      group1 &&
      group2 &&
      group3 &&
      group4 &&
      current1 &&
      current2 &&
      current3 &&
      current4
    ) {
      const groups = [group4, group3, group2, group1];

      for (let i = 0; i < data.length; i++) {
        if (groups[i]) groups[i].value = true;
      }

      for (let i = 0; i < data.length; i++) {
        rive.setTextRunValue(run[i], data[i].unit);
        const filterComplete = data.filter((item) => item.status === true);
        const filterCurrent = data.filter((item) => item.current === true);

        for (let j = 0; j < filterComplete.length; j++) {
          if (data[0] && filterComplete[j].unit === data[0].unit) {
            complete4.value = true;
            current4.value = false;
          }
          if (data[1] && filterComplete[j].unit === data[1].unit) {
            complete3.value = true;
            current3.value = false;
          }
          if (data[2] && filterComplete[j].unit === data[2].unit) {
            complete2.value = true;
            current2.value = false;
          }
          if (data[3] && filterComplete[j].unit === data[3].unit) {
            complete1.value = true;
            current1.value = false;
          }
        }

        for (let k = 0; k < filterCurrent.length; k++) {
          if (data[0] && filterCurrent[k].unit === data[0].unit) {
            current4.value = true;
          }
          if (data[1] && filterCurrent[k].unit === data[1].unit) {
            current3.value = true;
          }
          if (data[2] && filterCurrent[k].unit === data[2].unit) {
            current2.value = true;
          }
          if (data[3] && filterCurrent[k].unit === data[3].unit) {
            current1.value = true;
          }
        }
      }
      const buttonMapping = {
        click1: 3,
        click2: 2,
        click3: 1,
        click4: 0
      };

      rive.on('statechange', (event) => {
        const buttonIndex = buttonMapping[event.data[0]];

        if (buttonIndex !== undefined) {
          console.log(data[buttonIndex].unit); 
        }
      });
    }
  }, [rive, data, run, complete1, complete2, complete3, complete4, group1, group2, group3, group4]);

  return (
    <div className="element" ref={innerRef}>
      <RiveComponent style={{ width: "100%", height: "100%" }} />
    </div>
  );
};

const Map2 = () => {
  const containerRef = useRef(null);
  const elementRefs = useRef([]);

  const data = [
    { unit: "1", status:true, current: false },
    { unit: "2", status:true, current: false },
    { unit: "3", status:true, current: false },
    { unit: "4", status: false, current: true },
    { unit: "5", status: false, current: false },
    { unit: "6", status: false, current: false },
    { unit: "7", status: false, current: false },
    { unit: "8", status: false, current: false },
    { unit: "9", status: false, current: false },
    { unit: "10", status: false, current: false },
  ];

  function splitMainData(data, size = 4) {
    const result = [];
    for (let i = 0; i < data.length; i += size) {
      result.push(data.slice(i, i + size));
    }
    return result;
  }

  const splitData = splitMainData(data).reverse();
  const run = ["fourRun", "threeRun", "twoRun", "oneRun"];

  useEffect(() => {
  

const currentIndex = data.findIndex((item) => item.current === true);

if (currentIndex !== -1) {
    const reversedRefs = [...elementRefs.current].reverse(); // Make a shallow copy and reverse

    const element = reversedRefs[Math.floor(currentIndex / 4)];

    console.log("Current Index:", Math.floor(currentIndex / 4));
    console.log("Reversed Refs:", reversedRefs);

    if (containerRef.current && element) {
        element.scrollIntoView({ behavior: "smooth", block: "center" });
    }
}
  }, []);

  return (
    <div className="container" ref={containerRef}>
      {splitData.map((chunk, index) => (
        <RiveComponentWrapper
          key={index}
          index={index}
          run={run}
          data={chunk}
          innerRef={(el) => (elementRefs.current[index] = el)}
        />
      ))}
    </div>
  );
};

export default Map2;
