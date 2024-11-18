import { useRive } from "@rive-app/react-canvas";

const Robot = () => {
  const {rive, RiveComponent} = useRive({
    src: "/robotFace.riv",
    artboard: "Artboard",
    stateMachines: "State Machine 1",
    autoplay: true,
   
  });



  
  return (
<div style={{ width: '1000px', height: '700px',backgroundColor:'grey' }}>
    <RiveComponent style={{ width: '100%', height: '100%' }}  />
  </div>  );
};

export default Robot