import React from 'react';
import loadingGif from '../../images/loading.gif';
import './Loading.css';

export default function Loading() {
  return (
    <div className="loading">
      <div className="gif">
        <img src={ loadingGif } alt="gif" />
      </div>
    </div>
  );
}
