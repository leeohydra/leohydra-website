/**
 * Last known mouse position (clientX, clientY). Updated by MousePositionTracker
 * so that components like ArtworkImageWithMagnifier can detect "mouse already over"
 * after client-side navigation.
 */
export const lastKnownMousePosition = { x: 0, y: 0 };
