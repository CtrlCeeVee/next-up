import React from "react";
import { usePopover } from "./popover-context";
import { PopoverComponent } from "./popover.component";

export const PopoverManager: React.FC = () => {
  const { isVisible, currentPopover, hidePopover } = usePopover();

  return (
    <PopoverComponent
      isVisible={isVisible}
      config={currentPopover}
      onDismiss={hidePopover}
    />
  );
};
