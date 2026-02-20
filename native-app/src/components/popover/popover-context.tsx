import React, { createContext, useContext, useState, useCallback } from "react";

export interface PopoverConfig {
  content: React.ReactNode;
  onDismiss?: () => void;
  initialPosition?: {
    x: number;
    y: number;
  };
}

interface PopoverContextType {
  showPopover: (config: PopoverConfig) => void;
  hidePopover: () => void;
  isVisible: boolean;
  currentPopover: PopoverConfig | null;
}

const PopoverContext = createContext<PopoverContextType | undefined>(undefined);

export const PopoverProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const [currentPopover, setCurrentPopover] = useState<PopoverConfig | null>(
    null
  );

  const showPopover = useCallback((config: PopoverConfig) => {
    setCurrentPopover(config);
    setIsVisible(true);
  }, []);

  const hidePopover = useCallback(() => {
    setIsVisible(false);
    if (currentPopover?.onDismiss) {
      currentPopover.onDismiss();
    }
    setTimeout(() => {
      setCurrentPopover(null);
    }, 300);
  }, [currentPopover]);

  const value: PopoverContextType = {
    showPopover,
    hidePopover,
    isVisible,
    currentPopover,
  };

  return (
    <PopoverContext.Provider value={value}>{children}</PopoverContext.Provider>
  );
};

export const usePopover = (): PopoverContextType => {
  const context = useContext(PopoverContext);
  if (context === undefined) {
    throw new Error("usePopover must be used within a PopoverProvider");
  }
  return context;
};
