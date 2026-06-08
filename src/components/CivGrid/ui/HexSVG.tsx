export const HexPointySVG = ({ className = "", ...props }) => (
  <svg
    viewBox="0 0 100 100"
    className={`w-full h-full ${className}`}
    fill="currentColor"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <polygon points="50,0 100,30 100,70 50,100 0,70 0,30" />
  </svg>
);

export const HexOutlineSVG = ({ className = "", ...props }) => (
  <svg
    viewBox="0 0 100 100"
    className={`w-full h-full ${className}`}
    fill="none"
    stroke="currentColor"
    strokeWidth="8"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <polygon points="50,0 100,30 100,70 50,100 0,70 0,30" />
  </svg>
);

export const HexSVG = ({ className = "", ...props }) => (
  <svg
    viewBox="0 0 100 100"
    className={`w-full h-full ${className}`}
    fill="currentColor"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <polygon points="25,0 75,0 100,50 75,100 25,100 0,50" />
  </svg>
);