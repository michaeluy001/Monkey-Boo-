import { useState, useEffect, useRef } from "react";
import { motion } from "motion/react";
import DialogOverlay from "./DialogOverlay";
import { useLevelHandler } from "./GameLogicHelper";
import MonkeyWonOverlay from "./MonkeyWonOverlay";
import GameFinishedForm from "./GameFinishedForm";
import HomeButton from "./HomeButton";
import DialogScore from "./Dialog-Score";
import { TbPlayerTrackNextFilled } from "react-icons/tb";
import levelClear from "/src/assets/level-clear.mp3";
import gameWon from "/src/assets/you won.wav";
import useSound from "use-sound";
import { useGameContext } from "./GameContext";

const LevelUpDialog = (props) => {
  const { maxRound } = useLevelHandler();
  const { round } = useGameContext();
  const [playLevelClear, { sound, stop }, ] = useSound(levelClear);
  const [playGameWon] = useSound(gameWon);
  const delay = 0.5;

  const [isGameFinished, setGameFinished] = useState(false);

  const handleNext = () => {
    handleFadeOut();
    setTimeout(() => {
      props.onNextLevel();
    }, 300);
  };

  useEffect(() => {
    if (round >= maxRound) {
      setGameFinished(true);
    }
  }, [round]);

  useEffect(() => {
    playLevelClear();
    if (isGameFinished) playGameWon();
    return () => handleFadeOut();
  }, [playLevelClear]);

  const handleFadeOut = () => {
    if (sound) {
      sound.fade(sound.volume(), 0, 800);
      setTimeout(() => {
        sound.stop();
        sound.volume(1);
      }, 1500);
    }
  };

  return (
    <>
      <DialogOverlay timeout={0} duration={0.3} />

      <motion.div
        className="fixed left-1/2 max top-1/2 -translate-1/2 bg-amber-100 border-y-2 border-yellow-800 flex flex-col  h-75 w-full max-w-[500px] m-auto justify-center content-center items-center space-y-5 overflow-hidden rounded-4xl text-yellow-700"
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ duration: 1, delay: delay, type: "spring" }}
      >
        {isGameFinished && (
          <p className="text-3xl text-green-800 font-bold text-center p-2">
            You are the king of the jungle!
          </p>
        )}
        {!isGameFinished && (
          <motion.div
            className="text-xs text-yellow-800 font-bold text-center fixed top-5 right-5 rotate-15 rounded-full bg-yellow-300 size-23 content-center justify-items-center "
            initial={{ scale: 5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 1, type: "spring", delay: 1 }}
          >
            <p className="flex">
              Round <br /> Complete!
            </p>
          </motion.div>
        )}

        <DialogScore delayTime={delay} />

        {!isGameFinished ? (
          <NextLevelButton onNextLevel={handleNext} />
        ) : (
          <GameFinishedForm />
        )}

        {isGameFinished && <MonkeyWonOverlay />}

        <HomeButton className="absolute -left-5 -bottom-5 bg-green-800 size-20" />
      </motion.div>
    </>
  );
};

export const NextLevelButton = ({ onNextLevel }) => {
  const { round } = useGameContext();
  return (
    <>
      <motion.div
        className="text-md text-yellow-800 flex gap-2 items-center text-center border rounded-2xl p-2 shadow shadow-yellow-800 cursor-pointer hover:bg-yellow-800 hover:text-yellow-200 transition duration-300 active:scale-90 hover:scale-110"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1 }}
        onClick={onNextLevel}
      >
        <p className="">Round {round + 1}</p>
        <TbPlayerTrackNextFilled />
      </motion.div>
    </>
  );
};

export default LevelUpDialog;
