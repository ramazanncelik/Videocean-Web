"use client"
import PacmanLoader from 'react-spinners/PacmanLoader'
import HashLoader from 'react-spinners/HashLoader'

const CustomLoading = ({ type, size, color, className }) => {

  if (type === "pacman") {
    return (
      <div className={className}>
        <PacmanLoader
          color={color}
          loading={true}
          size={size}
          aria-label="Loading Spinner"
          data-testid="loader"
        />
      </div>
    );
  } else if (type === "hash") {
    return (
      <div className={className}>
        <HashLoader
          color={color}
          loading={true}
          size={size}
          aria-label="Loading Spinner"
          data-testid="loader"
        />
      </div>
    )
  }
};

export default CustomLoading;
