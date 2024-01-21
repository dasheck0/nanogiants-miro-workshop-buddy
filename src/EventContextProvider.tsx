import { FunctionComponent, ReactNode, createContext, useCallback, useContext, useState } from 'react';

export type EventType = 'startNewChat' | 'none';

interface EventContextType {
  lastEvent: EventType | null;
  dispatchEvent: (eventType: EventType) => void;
  clearEvent: () => void;
}

const EventContext = createContext<EventContextType>({
  lastEvent: null,
  dispatchEvent: () => {},
  clearEvent: () => {},
});
interface EventProviderProps {
  children: ReactNode;
}

export const EventProvider: FunctionComponent<EventProviderProps> = ({ children }) => {
  const [lastEvent, setLastEvent] = useState<EventType | null>(null);

  const dispatchEvent = useCallback((eventType: EventType) => {
    setLastEvent(eventType);
  }, []);
  const clearEvent = useCallback(() => {
    setLastEvent(null);
  }, []);

  return <EventContext.Provider value={{ lastEvent, dispatchEvent, clearEvent }}>{children}</EventContext.Provider>;
};

export const useEventContext = () => useContext(EventContext);
