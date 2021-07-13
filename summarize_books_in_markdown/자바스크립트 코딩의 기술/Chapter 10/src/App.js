import React from 'react';

import Copyright from './components/Copyright/Copyright';
import IdeaButton from './components/IdeaButton/IdeaButton';

function App() {
  return (
    <div className="main">
      <footer>
        <Copyright />
        <IdeaButton />
      </footer> 
    </div>
  );
}

export default App;