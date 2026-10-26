/** Category colors for markers and domain highlights, independent of status and brand colors. */
export const GOOD_MARKER_COLORS = [
  'sky', 'blue', 'indigo', 'violet', 'purple', 'fuchsia', 'pink', 'rose',
  'red', 'orange', 'amber', 'yellow', 'lime', 'green', 'teal', 'cyan',
] as const;

export type GoodMarkerColor = (typeof GOOD_MARKER_COLORS)[number];
