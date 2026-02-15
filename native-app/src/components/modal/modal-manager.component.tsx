import React from "react";
import { useModal } from "./modal-context";
import { ModalComponent } from "./modal.component";

export const ModalManager: React.FC = () => {
  const { isVisible, currentModal, hideModal } = useModal();

  return (
    <ModalComponent
      config={currentModal}
      isVisible={isVisible}
      onClose={hideModal}
    />
  );
};
