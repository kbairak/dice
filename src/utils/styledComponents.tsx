import { ComponentChild, ComponentChildren, createContext, RefObject, useClassBoolean } from 'domstatejsx';

// ==================== Layout Components ====================

export function Container({ children }: { children: ComponentChildren }) {
  return (
    <div className="h-screen bg-zinc-900 px-6 py-8 max-w-lg mx-auto flex flex-col gap-6">
      {children}
    </div>
  );
}

export function Flex({ children }: { children: ComponentChildren }) {
  return (
    <div className='flex gap-10 my-4'>
      <div className='flex-grow' />
      {children as ComponentChild}
      <div className='flex-grow' />
    </div>
  );
}

export function Fill() {
  return <div className="flex-1" />;
}

export function Scrollable({ children }: { children: ComponentChildren }) {
  return (
    <div
      className="overflow-y-auto flex-grow rounded-lg border border-zinc-800 bg-zinc-900/50 p-2"
    >
      {children}
    </div>
  );
}

// ==================== Typography Components ====================

export function Title({ children, ref }: { children?: ComponentChild, ref?: RefObject }) {
  ref = ref || {}
  return (
    <h1 ref={ref} className="text-4xl font-bold text-white text-center">{children}</h1>
  );
}

// ==================== Interactive Components ====================

export function Button({
  children,
  onClick,
  variant = 'primary',
  disabled = false,
  fullWidth = false,
  ref: _ref,
}: {
  children: ComponentChild;
  onClick?: (e: MouseEvent) => void;
  variant?: 'primary' | 'secondary' | 'icon';
  disabled?: boolean;
  fullWidth?: boolean;
  ref?: RefObject;
}) {
  const variantClasses = {
    primary: `bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-lg font-semibold
              text-lg shadow-lg shadow-purple-500/20 active:scale-95 transition-all
              disabled:opacity-50 disabled:cursor-not-allowed disabled:active:scale-100`,
    secondary: `bg-zinc-800 hover:bg-zinc-700 text-gray-100 px-6 py-3 rounded-lg font-semibold
                text-lg border border-zinc-700 active:scale-95 transition-all disabled:opacity-50
                disabled:cursor-not-allowed disabled:active:scale-100`,
    icon: `bg-zinc-800 hover:bg-zinc-700 text-gray-100 p-3 rounded-lg border border-zinc-700
           active:scale-95 transition-all disabled:opacity-50 disabled:cursor-not-allowed
           disabled:active:scale-100`,
  };

  const widthClass = fullWidth ? 'w-full' : '';

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`${variantClasses[variant]} ${widthClass}`}
    >
      {children}
    </button>
  );
}

export function Checkbox({ checked, onClick: onChange, ref: _ref }: {
  checked?: boolean; onClick?: (e: MouseEvent) => void; ref?: RefObject
}) {
  return (
    <input
      type="checkbox"
      checked={checked}
      onClick={onChange}
      className={`w-5 h-5 rounded border-2 border-zinc-600 bg-zinc-800 checked:bg-primary
                  checked:border-primary checked:shadow-lg checked:shadow-primary/30 focus:ring-2
                  focus:ring-primary/50 focus:outline-none cursor-pointer transition-all
                  accent-purple-500`}
    />
  );
}

export function Label({ children }: { children: ComponentChild[] }) {
  return (
    <label className="flex items-center gap-3 text-gray-200 py-2 cursor-pointer select-none">
      {children}
    </label>
  );
}

// ==================== Display Components ====================

export function Timer({ children, ref: _ref }: { children?: ComponentChild, ref: RefObject }) {
  return (
    <span className="text-5xl font-mono font-bold text-purple-500 tabular-nums">
      {children}
    </span>
  );
}

// ==================== Specialized Components ====================

export function ToggleGroup({ children }: { children: ComponentChildren }) {
  return (
    <div className="flex gap-2 p-1 bg-zinc-800 rounded-lg">
      {children}
    </div>
  );
}

export function ToggleButton({ children, active = false, onClick, ref }: {
  children: ComponentChild; active?: boolean, onClick?: (e: MouseEvent) => void; ref: RefObject
}) {
  ref = ref || {};

  const activeClasses = 'bg-primary text-white';
  const inactiveClasses = 'bg-transparent text-gray-400 hover:text-gray-200';

  const [getActive, setActive] = useClassBoolean(
    ref, activeClasses.split(' '), inactiveClasses.split(' ')
  )

  return (
    <ToggleButton.Context.Provider value={{ getActive, setActive }}>
      <button
        ref={ref}
        onClick={onClick}
        className={`px-4 py-2 rounded-md font-medium transition-all
                    ${active ? activeClasses : inactiveClasses}`}
      >
        {children}
      </button>
    </ToggleButton.Context.Provider>
  );
}
ToggleButton.Context = createContext();
