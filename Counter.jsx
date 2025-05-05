import { useState, useRef, useEffect } from 'react';
import bellSound from '/src/assets/bell.mp3';
import NowServingPanel from './NowServingPanel';

const STORAGE_KEY = 'queue-system';
const NEXT_NUMBER_KEY = 'next-number';

export default function Counter() {
  const [queue, setQueue] = useState([]);
  const [nextNumber, setNextNumber] = useState(1);
  const [nowServing, setNowServing] = useState(null);
  const doorbellRef = useRef(null);
  const voicesRef = useRef([]);

  // Load saved state
  useEffect(() => {
    const savedQueue = JSON.parse(localStorage.getItem(STORAGE_KEY));
    const savedNext = parseInt(localStorage.getItem(NEXT_NUMBER_KEY), 10);
    if (Array.isArray(savedQueue)) setQueue(savedQueue);
    if (!isNaN(savedNext)) setNextNumber(savedNext);
  }, []);

  // Save state on update
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(queue));
    localStorage.setItem(NEXT_NUMBER_KEY, nextNumber.toString());
  }, [queue, nextNumber]);

  // Load ResponsiveVoice
  useEffect(() => {
    const script = document.createElement('script');
    script.src = 'https://cdnjs.cloudflare.com/ajax/libs/ResponsiveVoice.js/1.5.0/responsivevoice.js';
    script.async = true;
    document.body.appendChild(script);
    return () => document.body.removeChild(script);
  }, []);

  useEffect(() => {
    const loadVoices = () => {
      voicesRef.current = window.speechSynthesis.getVoices();
    };
    window.speechSynthesis.onvoiceschanged = loadVoices;
    loadVoices();
  }, []);

  const playDoorbell = () => {
    if (doorbellRef.current) {
      doorbellRef.current.currentTime = 0;
      doorbellRef.current.play();
    }
  };

  const announceNumber = (number) => {
    const message = `..Please ...number ${number} ...go ..to ..counter`;
    if (window.responsiveVoice?.speak) {
      window.responsiveVoice.speak(message, 'UK English Female', { rate: 1 });
    } else {
      const femaleVoice = voicesRef.current.find((voice) =>
        voice.name.toLowerCase().includes('female') ||
        voice.name.toLowerCase().includes('woman') ||
        voice.name.toLowerCase().includes('zira') ||
        voice.name.toLowerCase().includes('google uk english female')
      ) || voicesRef.current[0];

      const speech = new SpeechSynthesisUtterance(message);
      speech.voice = femaleVoice;
      speech.pitch = 1.5;
      window.speechSynthesis.speak(speech);
    }
  };

  const handleNext = () => {
    if (queue.length === 0) return;
    const [servedNumber, ...restQueue] = queue;
    setNowServing(servedNumber);
    playDoorbell();
    announceNumber(servedNumber);
    setQueue(restQueue);
  };

  const handleJoin = () => {
    const currentQueue = [...queue];
    const existingNumbers = new Set(currentQueue);
    let smallestMissing = 1;
    while (existingNumbers.has(smallestMissing)) {
      smallestMissing++;
    }
    setQueue([...currentQueue, smallestMissing]);
    setNextNumber(nextNumber + 1);
  };

  const handleRepeat = () => {
    if (nowServing !== null) {
      announceNumber(nowServing);
      playDoorbell();
    }
  };

  const handleReset = () => {
    setQueue([]);
    setNextNumber(1);
    setNowServing(null);
  };

  return (
    <div className="p-6 space-y-6">
      <audio ref={doorbellRef} src={bellSound} />
      <NowServingPanel nowServing={nowServing} queue={queue} />

      <div className="flex space-x-4 mt-4">
        <button
          onClick={handleJoin}
          className="bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 px-4 rounded"
        >
          Join Queue
        </button>
        <button
          onClick={handleNext}
          className="bg-green-500 hover:bg-green-600 text-white font-medium py-2 px-4 rounded"
        >
          Next
        </button>
        <button
          onClick={handleRepeat}
          className="bg-yellow-500 hover:bg-yellow-600 text-white font-medium py-2 px-4 rounded"
        >
          Repeat
        </button>
        <button
          onClick={handleReset}
          className="bg-red-500 hover:bg-red-600 text-white font-medium py-2 px-4 rounded"
        >
          Reset
        </button>
      </div>
    </div>
  );
}
