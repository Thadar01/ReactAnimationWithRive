import React, { useEffect, useState, useRef } from "react";
import { useRive, useStateMachineInput, decodeImage } from "@rive-app/react-canvas";
import { coffeeShopConversation } from "./conData";
import { Howl } from "howler";
import "./Cafe.css"; 

const Cafe = () => {
  const [currentAsset, setCurrentAsset] = useState(null);
  const [currentId, setCurrentId] = useState(0);
  const [answer, setAnswer] = useState("");
  const [isButtonActive, setIsButtonActive] = useState(false);
  const audioRef = useRef(null); 
  const id = useRef(0);
  const greetingRef = useRef(null); // Reference for the greeting audio
  const [isSpeak,setIsSpeak]=useState(false);
  const [isHeader,setIsHeader]=useState(false)
  const { rive, RiveComponent } = useRive({
    src: "/coffee.riv",
    artboard: "CafeArtBoard",
    stateMachines: "State Machine 1",
    autoplay: true,
    onStateChange:(event)=>{
      console.log(event.data)
    },
    assetLoader: (asset) => {
      if (asset.isImage) {
        console.log("Loading image asset:", asset.name);

        if (asset.name === "coffeeCup2") {
          const currentPath = coffeeShopConversation[currentId].image;
          setCurrentAsset(asset);
          loadImageAsset(asset, currentPath);
          return true;
        }
      }
      return false;
    },
  });

  const loadImageAsset = (asset, imagePath) => {
    const img = new Image();
    img.src = imagePath;

    img.onload = async () => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');

      // Set the desired image size
      const desiredWidth = 1000;
      const desiredHeight = 1000;

      canvas.width = desiredWidth;
      canvas.height = desiredHeight;
      ctx.drawImage(img, 0, 0, desiredWidth, desiredHeight);

      const resizedImageDataUrl = canvas.toDataURL();
      const resizedImageBuffer = await fetch(resizedImageDataUrl).then((res) => res.arrayBuffer());
      const image = await decodeImage(new Uint8Array(resizedImageBuffer));

      asset.setRenderImage(image);
      console.log("Image replaced and resized successfully");

      image.unref();
    };

    img.onerror = (err) => {
      console.error("Error loading the image:", err);
    };
  };

  const boyBox = useStateMachineInput(rive, "State Machine 1", "CloseBoy");
  const girlBox = useStateMachineInput(rive, "State Machine 1", "CloseGirl");
  const boyTalk = useStateMachineInput(rive, "State Machine 1", "BoyTalk");
  const zoomIn = useStateMachineInput(rive, "State Machine 1", "ZoomIn");

useEffect(()=>{
  const playGreeting = () => {
    greetingRef.current = new Howl({
      src: ["/Greeting.mp3"],  // Path to the greeting audio file
      volume: 0.8,
      onload: () => {
        console.log("Greeting audio loaded successfully");
        greetingRef.current.play();
      },
      onplay:()=>{
        setIsHeader(true)
      },
      onend:()=>{
        setTimeout(()=>setIsHeader(false),1000)
      },
      onloaderror: (_, error) => {
        console.error("Error loading greeting audio:", error);
      },
    });
  };

  playGreeting(); // Play the greeting audio on component mount
},[])

  useEffect(() => {


    if (rive) {
      const currentConversation = coffeeShopConversation[currentId];
      const botAns = currentConversation.staff;
      const customerAns = currentConversation.customer;
      const customerAudio = () => {
        id.current = currentId;
        const conversation = coffeeShopConversation[id.current];
        console.log(conversation)
        if (conversation.customerVoice) {
          if (audioRef.current) {
            audioRef.current.stop();
          }
          audioRef.current = new Howl({
            src: [conversation.customerVoice],
            volume: 0.8,
            onload: () => {
              console.log("Audio loaded successfully");
              audioRef.current.play();
            },
            onplay:()=>{
              setIsSpeak(true)
            },
            onend:()=>{
              setIsSpeak(false)
            },
            onloaderror: (_, error) => {
              console.error("Error loading audio:", error);
            },
          });
        }
      };
  
      const playAudio = () => {
        id.current = currentId;
        const conversation = coffeeShopConversation[id.current];
        
        if (conversation.staffVoice) {
          if (audioRef.current) {
            audioRef.current.stop();
          }
          
          audioRef.current = new Howl({
            src: [conversation.staffVoice],
            volume: 0.8,
            onload: () => {
              console.log("Audio loaded successfully");
              audioRef.current.play();
            },
            onplay: () => {
              if (boyTalk) {
                boyTalk.value = true;
              }
              setIsSpeak(true);
            },
            onend: () => {
              boyTalk.value = false;
              setIsSpeak(false)

           
            },
            onloaderror: (_, error) => {
              console.error("Error loading audio:", error);
            },
          });
        }
      };
      


    if(currentId===0){
      setTimeout(()=>playAudio(),5000)
    }else{
      playAudio()
    }

      // Trigger animations
 

      if (zoomIn && currentConversation.id !== 7) {
        setTimeout(() => {
          zoomIn.value = true;
        }, 5000);
      }

      if (currentConversation.id === 7 && girlBox && boyBox ) {
        girlBox.value = true;
        setTimeout(() => {
          boyBox.value = true;
          zoomIn.value = false;
        }, 3000);
        setIsButtonActive(false);
      }

      // Update Rive text with conversation
      rive.setTextRunValue("GirlRun", customerAns);
      rive.setTextRunValue("BoyRun", botAns);

      // Handle image replacement for current asset
      if (currentAsset) {
        const imagePath = currentConversation.image;
        loadImageAsset(currentAsset, imagePath);
      }

      rive.on("statechange", (event) => {
        if (event.data[0] === "Cafe") {
          setTimeout(() => {
            setIsButtonActive(true);
          }, 5000);
        }
        if(event.data[0]==="VoiceOn"){
          playAudio();
        }
        if(event.data[0]==="GirlVoieOn"){
          customerAudio();
        }
      });
    }
  }, [rive, currentId, boyTalk, girlBox, boyBox, zoomIn, currentAsset]);

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      const currentConversation = coffeeShopConversation[currentId];
      const customerAns = currentConversation.customer;
      if (customerAns.toLowerCase() === answer.toLowerCase()) {
        handleAnswer(currentId + 1);
      } else {
        window.alert("Your answer is wrong");
      }
    }
  };

  const handleAnswer = (nextId) => {
    setCurrentId(nextId);
    setAnswer("");
  };

  return (
    <div className="container">
      {isHeader  &&  <h1>Ordering Coffee At Cafe</h1>
      }
      <RiveComponent className="riveComponent" />
      {isButtonActive && (
        <textarea
          className="textarea"
          placeholder="Enter text"
          value={answer}
          onChange={(e) => setAnswer(e.target.value)}
          onKeyDown={handleKeyDown}
          disabled={isSpeak}
        />
      )}
    </div>
  );
};

export default Cafe;
