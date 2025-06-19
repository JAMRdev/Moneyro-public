import React, { createContext, useContext, useState } from 'react';

interface MoneyVisibilityContextType {
  isMoneyVisible: boolean;
  toggleMoneyVisibility: () => void;
}

const MoneyVisibilityContext = createContext<MoneyVisibilityContextType | undefined>(undefined);

export const MoneyVisibilityProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isMoneyVisible, setIsMoneyVisible] = useState(true);

  const toggleMoneyVisibility = () => {
    setIsMoneyVisible(!isMoneyVisible);
  };

  return (
    <MoneyVisibilityContext.Provider value={{ isMoneyVisible, toggleMoneyVisibility }}>
      {children}
    </MoneyVisibilityContext.Provider>
  );
};

export const useMoneyVisibility = () => {
  const context = useContext(MoneyVisibilityContext);
  if (context === undefined) {
    throw new Error('useMoneyVisibility must be used within a MoneyVisibilityProvider');
  }
  return context;
};