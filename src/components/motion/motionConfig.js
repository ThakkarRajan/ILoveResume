/** Shared motion tokens — restrained, Apple-inspired pacing */
export const motionEase = [0.25, 0.1, 0.25, 1];

export const motionTransitions = {
  reveal: { duration: 0.55, ease: motionEase },
  hero: { duration: 0.7, ease: motionEase },
  quick: { duration: 0.35, ease: motionEase },
  stagger: { duration: 0.45, ease: motionEase },
};

export const motionDistance = {
  hero: 20,
  section: 14,
  item: 10,
  subtle: 6,
};

export const viewportDefaults = {
  once: true,
  amount: 0.18,
  margin: "-48px 0px -8% 0px",
};
