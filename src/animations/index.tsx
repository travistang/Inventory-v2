import React from "react";
import { Animated, AnimationString } from "react-animated-css";

export const AnimatedList = ({
  children,
  direction = 'fadeInUp'
}: {
  children: React.ReactElement<any>[];
  direction?: AnimationString
}) => (
  <>
    {children.map((child, i) => (
      <Animated
        animationIn={direction}
        isVisible
        animationOut="fadeOut"
        animationInDuration={400}
        animationInDelay={50 * i}
      >
        {child}
      </Animated>
    ))}
  </>
);

export const AnimatedDrop = ({ children }: { children: React.ReactChild }) => (
  <Animated
    animationIn="fadeInDown"
    isVisible
    animationOut="fadeOut"
    animationInDuration={400}
  >
    {children}
  </Animated>
);
