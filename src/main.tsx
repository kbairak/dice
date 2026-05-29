import './index.css';
import {
  createContext,
  RefObject,
  useCheckbox,
  useClassBoolean,
  useLocalStorage,
  usePropertyBoolean,
  useRefProxy,
  useTextContent,
} from 'domstatejsx';
import { POSITIONS } from './constants/positions';
import { CoupleType } from './types';
import { formatTime, parseTime } from './utils/timer';
import { choice } from './utils/random';
import { playBeep } from './utils/sound';
import {
  Container,
  Title,
  Button,
  Label,
  Checkbox,
  Timer,
  Scrollable,
  ToggleGroup,
  ToggleButton,
  Flex,
  Fill,
} from './utils/styledComponents';

function App() {
  const refs = useRefProxy();
  function handleStart(positions: string[], timer: number) {
    refs.main.context.start(positions, timer);
  }
  function handleStop() {
    refs.init.context.showHide(true)
  }

  return (
    <Container>
      <Title>Sex Dice</Title>
      <InitScreen ref={refs.init} onStart={handleStart} />
      <MainScreen ref={refs.main} onStop={handleStop} />
    </Container>
  );
}

function InitScreen({ ref: _ref, onStart }: {
  ref: RefObject; onStart: (positions: string[], timer: number) => void;
}) {
  const refs = useRefProxy();

  const [getCoupleTypeFromLocalStorage, saveCoupleTypeToLocalStorage] = useLocalStorage(
    'dice-couple-type', 'Straight'
  );
  function handleCoupleTypeChange(value: CoupleType) {
    const prevValue = getCoupleTypeFromLocalStorage();
    saveCoupleTypeToLocalStorage(value);
    if (prevValue !== value) {
      refs.optionsChecklist.current.replaceWith(
        <OptionsChecklist
          ref={refs.optionsChecklist}
          options={POSITIONS[value]}
          value={getSelectedPositions()}
          onChange={handlePositionsChange}
        />
      );
      disableStart(getSelectedPositions().length < 2);
    }
  }

  const positionHooks = Object.fromEntries(
    Object
      .keys(POSITIONS)
      .map((coupleType) => [
        coupleType, useLocalStorage(`dice-positions-${coupleType}`, '[]')
      ])
  );
  function getSelectedPositions() {
    const [get] = positionHooks[getCoupleTypeFromLocalStorage()!];
    return JSON.parse(get() || '[]') as string[];
  }
  function handlePositionsChange(value: string[]) {
    const [, set] = positionHooks[getCoupleTypeFromLocalStorage()!];
    set(JSON.stringify(value));
    disableStart(value.length < 2);
  }

  const [getTimerFromLocalStorage, saveTimerToLocalStorage] = useLocalStorage(
    'dice-timer', '120'
  );
  function getTimer() {
    return JSON.parse(getTimerFromLocalStorage() || '120');
  }
  function handleTimerChange(value: number) {
    saveTimerToLocalStorage(JSON.stringify(value));
  }

  const [, showHide] = useClassBoolean(refs.head, 'contents', 'hidden');
  function handleStart() {
    showHide(false);
    onStart(getSelectedPositions(), getTimer());
  }

  const [, disableStart] = usePropertyBoolean(refs.start, 'disabled', true, false);

  return (
    <InitScreen.Context.Provider ref={refs.head} value={{ showHide }}>
      <div class="contents">
        <CoupleTypeSelector
          value={getCoupleTypeFromLocalStorage() as CoupleType}
          onChange={handleCoupleTypeChange}
        />
        <OptionsChecklist
          ref={refs.optionsChecklist}
          options={POSITIONS[getCoupleTypeFromLocalStorage() as CoupleType]}
          value={getSelectedPositions()}
          onChange={handlePositionsChange}
        />
        <TimerControls value={getTimer()} onChange={handleTimerChange} />
        <Button ref={refs.start} onClick={handleStart} variant="primary">Start</Button>
      </div>
    </InitScreen.Context.Provider>
  );
}
InitScreen.Context = createContext();

function CoupleTypeSelector({ value, onChange }: {
  value: CoupleType; onChange: (v: CoupleType) => void;
}) {
  const refs = useRefProxy();

  function handleClick(event: MouseEvent) {
    const text = (event.target as HTMLElement)?.textContent?.trim();
    refs.buttonStraight.context.setActive(false)
    refs.buttonGay.context.setActive(false)
    refs.buttonLesbian.context.setActive(false)
    if (text === 'Straight') {
      refs.buttonStraight.context.setActive(true)
    } else if (text === 'Gay') {
      refs.buttonGay.context.setActive(true)
    } else if (text === 'Lesbian') {
      refs.buttonLesbian.context.setActive(true)
    }
    onChange(text as CoupleType);
  }

  return (
    <Flex>
      <ToggleGroup>
        <ToggleButton
          ref={refs.buttonStraight}
          onClick={handleClick}
          active={value === 'Straight'}
        >
          Straight
        </ToggleButton>
        <ToggleButton
          ref={refs.buttonGay}
          onClick={handleClick}
          active={value === 'Gay'}
        >
          Gay
        </ToggleButton>
        <ToggleButton
          ref={refs.buttonLesbian}
          onClick={handleClick}
          active={value === 'Lesbian'}
        >
          Lesbian
        </ToggleButton>
      </ToggleGroup>
    </Flex>
  );
}

function OptionsChecklist({ options, value, onChange = () => null, ref: _ref }: {
  options: readonly string[];
  value: string[];
  onChange?: (options: string[]) => void;
  ref?: RefObject;
}) {
  const refs = useRefProxy();

  const [, setSelectAll] = useCheckbox(refs.selectAll);

  function handleSelectAll() {
    const value = get();
    if (value.length < options.length) {
      optionCheckboxesRefs.forEach((ref) => ref.context.set(true));
      setSelectAll(true);
    } else {
      optionCheckboxesRefs.forEach((ref) => ref.context.set(false));
      setSelectAll(false);
    }
    onChange(get());
  }

  const optionCheckboxesRefs: RefObject[] = [];

  function get() {
    return optionCheckboxesRefs
      .filter((ref) => ref.context.get())
      .map((ref) => ref.context.value)
  }
  function handleChange() {
    const value = get();
    onChange(value);
    setSelectAll(value.length > 0);
  }

  return (
    <div class="contents">
      <Label>
        <Checkbox ref={refs.selectAll} onClick={handleSelectAll} checked={value.length > 0} />
        Select All
      </Label>
      <Scrollable>
        {
          options.map((option) => (
            <OptionCheckbox
              ref={(r) => optionCheckboxesRefs.push(r)}
              value={option}
              checked={value.includes(option)}
              onChange={() => handleChange()}
            />
          ))
        }
      </Scrollable>
    </div>
  );
}

function OptionCheckbox({ ref: _ref, value, checked, onChange: onClick }: {
  ref: RefObject | ((r: RefObject) => void);
  value: string;
  checked: boolean;
  onChange: (value: string) => void;
}) {
  const refs = useRefProxy();
  const [get, set] = useCheckbox(refs.input);
  return (
    <OptionCheckbox.Context.Provider value={{ get, set, value }}>
      <Label>
        <Checkbox
          ref={refs.input}
          checked={checked}
          onClick={() => onClick(value)}
        />
        {value}
      </Label>
    </OptionCheckbox.Context.Provider>
  );
}
OptionCheckbox.Context = createContext()

function TimerControls({ value, onChange }: { value: number; onChange: (v: number) => void }) {
  const refs = useRefProxy();

  const [, disableDown] = usePropertyBoolean(refs.buttonDown, 'disabled', true, false);
  const [, disableUp] = usePropertyBoolean(refs.buttonUp, 'disabled', true, false);

  const [getTimerStr, setTimerStr] = useTextContent(refs.span);

  function _handleChange(direction: 'up' | 'down') {
    let seconds = parseTime(getTimerStr());
    if (direction === 'up' && seconds < 10 * 60) {
      if (seconds >= 3 * 60) {
        seconds += 30;
      } else {
        seconds += 10;
      }
    } else if (seconds > 10) {
      if (seconds <= 3 * 60) {
        seconds -= 10;
      } else {
        seconds -= 30;
      }
    }
    setTimerStr(formatTime(seconds));
    disableDown(seconds <= 10)
    disableUp(seconds >= 10 * 60)
    onChange(seconds);
  }
  function handleUp() {
    _handleChange('up');
  }
  function handleDown() {
    _handleChange('down')
  }

  return (
    <Flex>
      <Button ref={refs.buttonDown} onClick={handleDown} variant="icon">-</Button>
      <Timer ref={refs.span}>{formatTime(value)}</Timer>
      <Button ref={refs.buttonUp} onClick={handleUp} variant="icon">+</Button>
    </Flex>
  );
}
TimerControls.Context = createContext();

function MainScreen({ ref: _ref, onStop }: { ref: RefObject; onStop: () => void }) {
  const refs = useRefProxy();

  const [, showHide] = useClassBoolean(refs.head, 'contents', 'hidden');
  const [, setPosition] = useTextContent(refs.position);
  const [, setTimer] = useTextContent(refs.timer);

  let intervalId: number | null = null;
  function start(positions: string[], timer: number) {
    let lastChoice = choice(positions)
    setPosition(lastChoice);
    setTimer(formatTime(timer));
    showHide(true);
    let start = Date.now();
    intervalId = setInterval(() => {
      const ms = Date.now() - start;
      if (ms < timer * 1000) {
        setTimer(formatTime(Math.max(0, timer - Math.floor(ms / 1000))));
      } else {
        let nextChoice = choice(positions);
        while (nextChoice === lastChoice) {
          nextChoice = choice(positions);
        }
        lastChoice = nextChoice;
        setPosition(lastChoice);
        start = Date.now();
        playBeep()
      }
    }, 0.1);
  }

  function handleStop() {
    clearInterval(intervalId!);
    showHide(false);
    onStop();
  }

  return (
    <MainScreen.Context.Provider value={{ start }}>
      <div ref={refs.head} class="hidden">
        <Fill />
        <Title ref={refs.position}></Title>
        <Fill />
        <Flex>
          <Timer ref={refs.timer} />
        </Flex>
        <Button onClick={handleStop} variant="primary" fullWidth>Stop</Button>
      </div>
    </MainScreen.Context.Provider>
  );
}
MainScreen.Context = createContext();

document.getElementById('app')!.replaceWith(<App />);
