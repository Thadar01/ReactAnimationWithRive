import { useRive, useStateMachineInput,decodeImage,AssetToLoader } from "@rive-app/react-canvas";
import { useEffect, useRef, useState } from "react";
import { easyData,hardData,mediumData } from "./memoryData";
import { Howl } from "howler";

const Memory = () => {
  const[data,setData]=useState(easyData)

  const { rive, RiveComponent } = useRive({
    src: "/memorytesting.riv",
    artboard: "MemoryArtboard",
    stateMachines: "State Machine 2",
    autoplay: true,
    assetLoader: (asset) => {
      if (asset.isImage) {
        const imageMapping = {
          apple: data[0]?.image,
          dog: data[1]?.image,
          tree: data[2]?.image,
          singer: data[3]?.image,
          girl: data[4]?.image,
          girlboy: data[5]?.image,
        };
        const imagePath = imageMapping[asset.name];
        if (imagePath) {
          loadImageAsset(asset, imagePath);
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

      // Set the desired image size (optional)
      const desiredWidth = 1000;
      const desiredHeight = 1000;

      canvas.width = desiredWidth;
      canvas.height = desiredHeight;
      ctx.drawImage(img, 0, 0, desiredWidth, desiredHeight);

      const resizedImageDataUrl = canvas.toDataURL();
      const resizedImageBuffer = await fetch(resizedImageDataUrl).then((res) => res.arrayBuffer());
      const image = await decodeImage(new Uint8Array(resizedImageBuffer));

      asset.setRenderImage(image); // Set the new image to the Rive asset
      console.log("Image replaced successfully for:", asset.name);
    };

    img.onerror = (error) => {
      console.error("Error loading image:", error);
    };
  };
const audioPlayers = data.map((card) => {
  if (card.audio) {
    return new Howl({
      src: [card.audio],
      volume: 1.0,
      onloaderror: (id, error) => console.error("Audio load error:", error),
      onplayerror: (id, error) => console.error("Audio play error:", error),
    });
  }
  return null;
});


  const inputs = [
    useStateMachineInput(rive, "State Machine 2", "card1close"),
    useStateMachineInput(rive, "State Machine 2", "card2close"),
    useStateMachineInput(rive, "State Machine 2", "card3close"),
    useStateMachineInput(rive, "State Machine 2", "card4close"),
    useStateMachineInput(rive, "State Machine 2", "card5close"),
    useStateMachineInput(rive, "State Machine 2", "card6close"),
  ];
  const disappears = [
    useStateMachineInput(rive, "State Machine 2", "disappear1"),
    useStateMachineInput(rive, "State Machine 2", "disappear2"),
    useStateMachineInput(rive, "State Machine 2", "disappear3"),
    useStateMachineInput(rive, "State Machine 2", "disappear4"),
    useStateMachineInput(rive, "State Machine 2", "disappear5"),
    useStateMachineInput(rive, "State Machine 2", "disappear6"),
  ];

  const isImage=[  useStateMachineInput(rive, "State Machine 2", "isImage1"),
    useStateMachineInput(rive, "State Machine 2", "isImage2"),
     useStateMachineInput(rive, "State Machine 2", "isImage3"),
     useStateMachineInput(rive, "State Machine 2", "isImage4"),
    useStateMachineInput(rive, "State Machine 2", "isImage5"),
     useStateMachineInput(rive, "State Machine 2", "isImage6"),]



  const run = [
    "card1Run",
    "card2Run",
    "card3Run",
    "card4Run",
    "card5Run",
    "card6Run",
  ];

  const openedCards = useRef([]); 

  useEffect(() => {
    if (rive && inputs.every((input) => input)) {
      setTimeout(() => {
        inputs.forEach((input) => (input.value = true));
      }, 5000);
  
      if (data === easyData) {
        data.forEach((item, i) => {
          if (item.image && rive && isImage) {
            isImage[i].value = true;
          }
        });
      } else if (data === mediumData) {
        data.forEach((item, i) => {
          if (item.image && rive && run[i]) {
            rive.setTextRunValue(run[i], 'Image');
            isImage[i].value = true;
          } else if (rive && run[i]) {
            isImage[i].value = false;
            rive.setTextRunValue(run[i], item.text);
          }
        });
      } else if(data===hardData) {
        console.log('hard')
        data.forEach((item, i) => {
          isImage[i].value=false

          if (item.image && rive && run[i]) {
            rive.setTextRunValue(run[i], 'Audio');
        
          } else if (rive && run[i]) {
            rive.setTextRunValue(run[i], item.text);

          }
        });
      }
  
      // Listen for state changes
      rive.on("statechange", (event) => {
        const cardMapping = {
          openCard1: { data: data[0], input: inputs[0], disappear: disappears[0], audio: audioPlayers[0] },
          openCard2: { data: data[1], input: inputs[1], disappear: disappears[1], audio: audioPlayers[1] },
          openCard3: { data: data[2], input: inputs[2], disappear: disappears[2], audio: audioPlayers[2] },
          openCard4: { data: data[3], input: inputs[3], disappear: disappears[3], audio: audioPlayers[3] },
          openCard5: { data: data[4], input: inputs[4], disappear: disappears[4], audio: audioPlayers[4] },
          openCard6: { data: data[5], input: inputs[5], disappear: disappears[5], audio: audioPlayers[5] },
        };
  
        const openedCard = cardMapping[event.data[0]];
        if (openedCard) {
          if (openedCard.audio) {
            openedCard.audio.play();
            console.log("playAudio");
          }
  
          if (
            !openedCards.current.some(
              (card) => card.data.id === openedCard.data.id
            )
          ) {
            openedCards.current.push(openedCard);
            if (openedCards.current.length > 2) {
              openedCards.current.shift();
            }
  
            console.log("Opened cards:", openedCards.current);
            if (openedCards.current.length === 2) {
              const [firstCard, secondCard] = openedCards.current;
  
              if (firstCard.data.text === secondCard.data.text) {
                console.log("Match found:", firstCard.data, secondCard.data);
                setTimeout(() => {
                  firstCard.disappear.value = true;
                  secondCard.disappear.value = true;
                  openedCards.current = [];
                }, 1000);
              } else {
                console.log("No match:", firstCard.data, secondCard.data);
  
                setTimeout(() => {
                  firstCard.input.value = true;
                  secondCard.input.value = true;
                  openedCards.current = [];
                }, 1000);
              }
            }
          }
        }
  
        if (event.data.find((item) => item === "Easy")) {
          setData(easyData);
          console.log("easy", easyData);
        }
        if (event.data.find((item) => item === "Medium")) {
          setData(mediumData);
          console.log('medium', mediumData);
        }
        if (event.data.find((item) => item === "Hard")) {
          setData(hardData);
          console.log("hard", hardData);
        
          // Reload the images for "Hard"
          if (rive && rive.asset && rive.asset.isImage) {
            const imageMapping = {
              apple: hardData[0]?.image,
              dog: hardData[1]?.image,
              tree: hardData[2]?.image,
              singer: hardData[3]?.image,
              girl: hardData[4]?.image,
              girlboy: hardData[5]?.image,
            };
        
            const imagePath = imageMapping[rive.asset.name];
            if (imagePath) {
              // Reload the AssetToLoader
              AssetToLoader.reload(rive.asset, imagePath)
                .then(() => {
                  console.log(`Asset reloaded successfully: ${rive.asset.name}`);
                })
                .catch((error) => {
                  console.error(`Failed to reload asset: ${rive.asset.name}`, error);
                });
        
              return true; // Indicate success
            }
          }
          return false; // Indicate failure if no matching asset
        }
        
        
      });
    }
  }, [rive, inputs, isImage, disappears, data]);
  
  return (
    <div style={{ width: "1000px", height: "700px" }}>
      <RiveComponent style={{ width: "100%", height: "100%" }} />
    </div>
  );
};

export default Memory;
