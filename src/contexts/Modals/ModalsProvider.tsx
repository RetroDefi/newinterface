import React, { createContext, useCallback, useState } from "react";
import "./Modals.scss";

interface ModalsContext {
  content?: React.ReactNode;
  isOpen?: boolean;
  onPresent: (content: React.ReactNode) => void;
  onDismiss: () => void;
}

export const Context = createContext<ModalsContext>({
  onPresent: () => {},
  onDismiss: () => {}
});

const ModalsProvider: React.FC = ({ children }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [content, setContent] = useState<React.ReactNode>();

  const handlePresent = useCallback(
    (modalContent: React.ReactNode) => {
      setContent(modalContent);
      setIsOpen(true);
    },
    [setContent, setIsOpen]
  );

  const handleDismiss = useCallback(() => {
    setContent(undefined);
    setIsOpen(false);
  }, [setContent, setIsOpen]);

  return (
    <Context.Provider
      value={{
        content,
        isOpen,
        onPresent: handlePresent,
        onDismiss: handleDismiss
      }}
    >
      {children}
      {isOpen && (
        <div className="modal-wrapper">
          <div className="modal-backdrop" onClick={handleDismiss} />
          {React.isValidElement(content) &&
            React.cloneElement(content, {
              onDismiss: handleDismiss
            })}
        </div>
      )}
    </Context.Provider>
  );
};

export default ModalsProvider;
