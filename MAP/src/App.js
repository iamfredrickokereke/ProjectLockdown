import { useEffect, useState } from 'react';
import { Map } from './components/Map/Map';
import { LoadingAnimation } from './components/LoadingAnimation/LoadingAnimation';
import { Legend } from './components/Legend/Legend';
import Totals from './components/Totals/Totals';
import Header from './components/Header/Header';
import LanguageSelector from './components/LanguageSelector/LanguageSelector';
import './App.scss';
import { TabMenu } from './components/TabMenu/TabMenu';
import ThemeContext from './context/ThemeContext';
import format from 'date-fns/format';
import PlayButton from './components/PlayButton/PlayButton';
import { addDays } from 'date-fns';
import CountriesSearcher from './components/CountriesSearcher/CountriesSearcher';

// FIX: Selected date is formatted (yyyy-mm-dd) while start and end dates are in normal formats (new Date()).

// TODO: Reset selectedDate to startDate once endDate is reached.

function toJsonString(date) {
  return format(date, 'yyyy-MM-dd');
}

const daysRange = 50;

const startingPoint = -300;

const playSpeed = 200;
// i.e. delay between skipping to the next date (in ms)

const playerStates = {
  PLAYING: 'PLAYING',
  PAUSED: 'PAUSED',
};

const { PLAYING, PAUSED } = playerStates;

function App() {
  const [isLoading, setIsLoading] = useState(true);
  const [isDark, setIsDark] = useState(false);
  const [playerState, setPlayerState] = useState(PAUSED);

  // selectedDate -> the date for which the datapoints are being displayed. defaults to todays' date.
  // Currently using 4th April 2020 as a starting date, and end date 50 days away from it. This will be handled once the timeslider is done.
  const [selectedDate, setSelectedDate] = useState(
    toJsonString(addDays(new Date(), startingPoint))
  );

  const startDate = addDays(new Date(), startingPoint);
  const endDate = addDays(new Date(), startingPoint + daysRange);

  // For later, when we integrate the timeslider
  // const [startDate, setStartDate] = useState(
  //   addDays(new Date(), startingPoint)
  // );
  // const [endDate, setEndDate] = useState(
  //   addDays(new Date(), startingPoint + daysRange)
  // );

  const toggleState = newState => {
    setPlayerState(newState);
  };

  useEffect(() => {
    const formattedSelectedDate = new Date(selectedDate);

    console.log('End date', endDate);
    console.log('Selected date v', formattedSelectedDate);

    if (formattedSelectedDate.getDate() === endDate.getDate()) {
      alert('Ended');
      setPlayerState(PAUSED);
      setSelectedDate(format(startDate, 'yyyy-MM-dd'));
    }
  }, [selectedDate, endDate, startDate]);

  useEffect(() => {
    console.log('Selected date', selectedDate);
  }, [selectedDate]);

  useEffect(() => {
    console.log('Player state', playerState);
  }, [playerState]);

  useEffect(() => {
    const formattedSelectedDate = new Date(selectedDate);

    if (playerState === PLAYING) {
      var loop = setInterval(() => {
        if (playerState === PAUSED || formattedSelectedDate === endDate) {
          console.log('Stopped');
          clearInterval(loop);
        } else {
          console.log('Still looping');
          setSelectedDate(
            format(addDays(formattedSelectedDate, 1), 'yyyy-MM-dd')
          );
        }
      }, playSpeed);
    }

    return () => clearInterval(loop);
  }, [playerState, selectedDate, endDate]);

  useEffect(() => {
    const darkModePreference = window.localStorage.getItem('darkmode');

    if (!darkModePreference) {
      setIsDark(window.matchMedia('(prefers-color-scheme: dark)').matches);
      document.getElementsByTagName('html')[0].classList.add('dark');
      window.localStorage.setItem('darkmode', 'true');
    }

    if (darkModePreference === 'true') {
      document.getElementsByTagName('html')[0].classList.add('dark');
      setIsDark(true);
    } else if (darkModePreference === 'false') {
      setIsDark(false);
    }
  }, []);

  return (
    <div
      onKeyUp={e => {
        if (e.key === ' ') {
          const newState = playerState === PAUSED ? PLAYING : PAUSED;

          toggleState(newState);
        }
      }}
    >
      <ThemeContext.Provider value={{ isDark, setIsDark }}>
        <LoadingAnimation isLoading={isLoading} />
        <Map
          dark={isDark}
          selectedDate={selectedDate}
          startDate={startDate}
          endDate={endDate}
          setIsLoading={setIsLoading}
          daysRange={daysRange}
        ></Map>
        <TabMenu darkMode={isDark} setDarkMode={setIsDark} />
        <Header dark={isDark} />
        <Totals dark={isDark} />
        <Legend dark={isDark} />
        {/* <CountriesSearcher i18n={{ locale: 'en, en-US' }} /> */}
        <PlayButton state={playerState} toggleState={toggleState} />
        <LanguageSelector dark={isDark} />
      </ThemeContext.Provider>
    </div>
  );
}

export default App;
