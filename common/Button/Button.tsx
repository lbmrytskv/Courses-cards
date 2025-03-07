import React, { ReactNode } from 'react';

interface ButtonProps {
  buttonText: ReactNode;
  onClick?: () => void;
  className?: string; 
}

function Button({ buttonText, onClick = () => {}, className = "button" }: ButtonProps) {
  return (
    <button onClick={onClick} className={className}>
      {buttonText}
    </button>
  );
}

export default Button;
