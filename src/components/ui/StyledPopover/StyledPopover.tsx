import {
  FloatingPortal,
  autoUpdate,
  flip,
  offset,
  shift,
  useDismiss,
  useFloating,
  useInteractions,
  useRole,
} from "@floating-ui/react";
import React, { ReactElement, useState } from "react";

import classes from "./StyledPopover.module.css";

interface Props {
  content: ReactElement<any>;
  children: ReactElement<any>;
  size?: "sm" | "md" | "lg";
}

const SIZE_MAP = {
  sm: 200,
  md: 300,
  lg: 400,
};

const StyledPopover: React.FC<Props> = ({ content, size = "sm", children }) => {
  const [isPopoverOpen, setIsPopoverOpen] = useState(false);
  const [isPopoverActive, setIsPopoverActive] = useState(false);
  const open = isPopoverActive || isPopoverOpen;
  const { refs, floatingStyles, context } = useFloating({
    open,
    onOpenChange: (nextOpen) => {
      if (!nextOpen) {
        setIsPopoverOpen(false);
        setIsPopoverActive(false);
      }
    },
    placement: "top",
    middleware: [offset(12), flip(), shift({ padding: 12 })],
    whileElementsMounted: autoUpdate,
  });
  const dismiss = useDismiss(context);
  const role = useRole(context, { role: "tooltip" });
  const { getFloatingProps } = useInteractions([dismiss, role]);

  if (!children) {
    return <div></div>;
  }
  return (
    <>
      {React.cloneElement(children, {
        ref: refs.setReference,
        onClick: (event: React.MouseEvent) => {
          children.props.onClick?.(event);
          setIsPopoverActive((current) => !current);
        },
        onMouseEnter: (event: React.MouseEvent) => {
          children.props.onMouseEnter?.(event);
          if (!isPopoverActive) {
            setIsPopoverOpen(true);
          }
        },
        onMouseLeave: (event: React.MouseEvent) => {
          children.props.onMouseLeave?.(event);
          if (!isPopoverActive) {
            setIsPopoverOpen(false);
          }
        },
      } as any)}

      {open ? (
        <FloatingPortal>
          <div
            ref={refs.setFloating}
            style={{ ...floatingStyles, zIndex: 10000 }}
            className={classes.root}
            {...getFloatingProps()}
          >
            <div style={{ width: SIZE_MAP[size] }} className={classes.popover}>
              {content}
            </div>
          </div>
        </FloatingPortal>
      ) : null}
    </>
  );
};

export default StyledPopover;
