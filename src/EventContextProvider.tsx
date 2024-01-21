import { FunctionComponent, ReactNode, createContext, useCallback, useContext, useState } from 'react';

export type EventType = 'startNewChat';

interface EventContextType {
  lastEvent: EventType | null;
  dispatchEvent: (eventType: EventType) => void;
}

const EventContext = createContext<EventContextType>({
  lastEvent: null,
  dispatchEvent: () => {},
});

interface EventProviderProps {
  children: ReactNode;
}

export const EventProvider: FunctionComponent<EventProviderProps> = ({ children }) => {
  const [lastEvent, setLastEvent] = useState<EventType | null>(null);

  const dispatchEvent = useCallback((eventType: EventType) => {
    setLastEvent(eventType);
  }, []);

  return <EventContext.Provider value={{ lastEvent, dispatchEvent }}>{children}</EventContext.Provider>;
};

export const useEventContext = () => useContext(EventContext);
