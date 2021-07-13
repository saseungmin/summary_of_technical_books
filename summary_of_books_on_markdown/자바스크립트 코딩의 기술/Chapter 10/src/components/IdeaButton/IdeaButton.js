import React from 'react';

import './IdeaButton.css';
import idea from './React-icon.svg';

function IdeaButton() {
  return (
      <img
        className="idea-button__icon"
        src={idea}
        alt="idea icon"
      />
  );
}

export default IdeaButton;