import React, { useState } from 'react';

const CharacterStatus = ({ health, mana, gold, setHealth, setMana, setGold }) => {
  return (
    <div className="character-status">
      <h3>キャラクターステータス</h3>
      <div className="status-bar">
        <div className="status-item">
          <span>HP: </span>
          <progress value={health} max="100" className="health-bar"></progress>
          <span>{health}/100</span>
        </div>
        <div className="status-item">
          <span>MP: </span>
          <progress value={mana} max="100" className="mana-bar"></progress>
          <span>{mana}/100</span>
        </div>
        <div className="status-item">
          <span>ゴールド: </span>
          <span>{gold}</span>
        </div>
      </div>
    </div>
  );
};

export default CharacterStatus;
