import React, { useState, useEffect, useCallback, useRef } from 'react';

const Logo = React.memo(() => (
  <img
    src={`${process.env.PUBLIC_URL}/logo.png`}
    alt="Logo"
    style={{
      position: 'fixed',
      top: '20px',
      left: '20px',
      width: '250px', // Adjust this value based on your logo size
      height: 'auto',
      zIndex: 1002, // Ensures logo appears above other elements
    }}
  />
));

const PixelLight = React.memo(({ id, top, left, color, delay, isVisible }) => (
  <div 
    id={id}
    className="pixel-light"
    style={{
      position: 'fixed',
      top: `${top}%`,
      left: `${left}%`,
      width: '10px',
      height: '10px',
      backgroundColor: color,
      boxShadow: `0 0 10px ${color}, 0 0 20px ${color}`,
      borderRadius: '50%',
      opacity: isVisible ? 1 : 0,
      transition: `opacity 300ms ease ${delay}ms`,
      zIndex: 1000,
    }}
  />
));

const NeonText = React.memo(({ id, text, delay, color, fontSize = '6rem', top = '50%', isVisible }) => (
  <div 
    id={id}
    className="neon-text"
    style={{ 
      position: 'fixed',
      left: '50%',
      transform: 'translateX(-50%)',
      top: top,
      opacity: isVisible ? 1 : 0,
      transition: `opacity 500ms ease ${delay}ms`,
      color: '#fff', 
      textShadow: `
        0 0 5px #fff,
        0 0 10px #fff,
        0 0 15px ${color},
        0 0 20px ${color},
        0 0 35px ${color},
        0 0 40px ${color},
        0 0 50px ${color},
        0 0 75px ${color}
      `,
      fontFamily: "'Audiowide', sans-serif",
      fontSize: fontSize,
      fontWeight: '400',
      letterSpacing: '2px',
      zIndex: 1001,
      whiteSpace: 'nowrap',
      textStroke: '1px #fff',
      WebkitTextStroke: '1px #fff',
    }}
  >
    {text}
  </div>
));

const NeonLightShow = () => {
  const [started, setStarted] = useState(false);
  const [lights, setLights] = useState([]);
  const [showBasepaint, setShowBasepaint] = useState(false);
  const [showDayNumber, setShowDayNumber] = useState(false);
  const audioRef = useRef(new Audio(`${process.env.PUBLIC_URL}/Cosmic.mp3`));

  const generateLights = useCallback(() => {
    const newLights = [];
    const colors = ['#ff0000', '#00ff00', '#0000ff', '#ffff00', '#ff00ff', '#00ffff'];
    for (let i = 0; i < 100; i++) {
      newLights.push({
        id: `light-${i}`,
        top: Math.random() * 100,
        left: Math.random() * 100,
        color: colors[Math.floor(Math.random() * colors.length)],
        delay: Math.random() * 2000 + i * 20,
        isVisible: false
      });
    }
    return newLights;
  }, []);

  useEffect(() => {
    if (started) {
      console.log("Show started!");
      audioRef.current.play().catch(error => console.error("Error playing audio:", error));
      
      const newLights = generateLights();
      setLights(newLights);
      
      newLights.forEach((light, index) => {
        setTimeout(() => {
          setLights(prevLights => 
            prevLights.map(l => l.id === light.id ? {...l, isVisible: true} : l)
          );
        }, light.delay);
      });

      setTimeout(() => {
        console.log("Showing BASEPAINT");
        setShowBasepaint(true);
      }, 2500);

      setTimeout(() => {
        console.log("Showing DAY NUMBER");
        setShowDayNumber(true);
      }, 3000);
    }

    return () => {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    };
  }, [started, generateLights]);

  const startShow = () => {
    console.log("Play button clicked!");
    setStarted(true);
  };

  return (
    <div className="neon-light-show">
          <Logo /> {/* Add this line here */}

      {!started && (
        <button onClick={startShow} className="start-button">
          PLAY
        </button>
      )}
      <div className="lights-container">
        {lights.map((light) => (
          <PixelLight key={light.id} {...light} />
        ))}
        {started && (
          <>
            <NeonText id="basepaint-text" text="BASEPAINT" delay={2500} color="#50ffa0" top="40%" isVisible={showBasepaint} />
            <NeonText id="day-number-text" text="DAY NUMBER 334" delay={3000} color="#ff50a0" fontSize="3rem" top="60%" isVisible={showDayNumber} />
          </>
        )}
      </div>
    </div>
  );
};

export default NeonLightShow;