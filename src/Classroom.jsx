import { useRive } from "@rive-app/react-canvas";

const Classroom = () => {
  const {rive, RiveComponent} = useRive({
    src: "/classroomtesting.riv",
    artboard: "ClassroomArtBoard 2",
    stateMachines: "State Machine 1",
    autoplay: true,
   
  });



  
  return (
<div style={{ width: '1000px', height: '700px' }}>
    <RiveComponent style={{ width: '100%', height: '100%' }}  />
  </div>  );
};

export default Classroom