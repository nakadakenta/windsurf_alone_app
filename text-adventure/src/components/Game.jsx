import React, { useState } from 'react';
import './Game.css';
import CharacterStatus from './CharacterStatus';
import EventSystem from './EventSystem';

const Game = () => {
  const [location, setLocation] = useState('start');
  const [inventory, setInventory] = useState([]);
  const [message, setMessage] = useState('');
  const [health, setHealth] = useState(100);
  const [mana, setMana] = useState(100);
  const [gold, setGold] = useState(100);

  const locations = {
    start: {
      description: 'あなたは村の入り口にいます。森が見えます。',
      options: [
        { text: '森に入る', location: 'forest' },
        { text: '村を探索する', location: 'village' },
        { text: '商人と話す', location: 'shop' }
      ]
    },
    forest: {
      description: '深い森の中にいます。木々が茂っています。',
      options: [
        { text: '戻る', location: 'start' },
        { text: '奥に進む', location: 'deepForest' },
        { text: '火をつける', location: 'forest', action: () => {
          if (inventory.includes('torch')) {
            setMessage('火をつけて周囲を照らしました！');
          } else {
            setMessage('火をつけるための道具がありません。');
          }
        } }
      ]
    },
    deepForest: {
      description: 'さらに深い森に進みました。不気味な音が聞こえます。',
      options: [
        { text: '戻る', location: 'forest' },
        { text: '謎の光に進む', location: 'treasure' },
        { text: '魔法を使う', location: 'deepForest', action: () => {
          if (mana >= 30) {
            setMana((prev) => prev - 30);
            setMessage('魔法を使用して、周囲の敵を追い払いました！');
          } else {
            setMessage('MPが足りません。');
          }
        } }
      ]
    },
    village: {
      description: '村の中心部にいます。商人がいます。',
      options: [
        { text: '戻る', location: 'start' },
        { text: '商人と話す', location: 'shop' },
        { text: '村人を助ける', location: 'village', action: () => {
          if (inventory.includes('potion')) {
            setInventory((prev) => prev.filter(item => item !== 'potion'));
            setMessage('村人に回復薬を渡しました。感謝されました！');
            setGold((prev) => prev + 20);
          } else {
            setMessage('村人に助けるためのアイテムがありません。');
          }
        } }
      ]
    },
    shop: {
      description: '商人と話しました。アイテムを手に入れました！',
      options: [
        { text: '戻る', location: 'village' },
        { text: '回復薬を購入', location: 'shop', action: () => {
          if (gold >= 50) {
            setGold((prev) => prev - 50);
            setInventory((prev) => [...prev, 'potion']);
            setMessage('50ゴールドで回復薬を購入しました！');
          } else {
            setMessage('ゴールドが足りません。');
          }
        } },
        { text: '火打ち石を購入', location: 'shop', action: () => {
          if (gold >= 30) {
            setGold((prev) => prev - 30);
            setInventory((prev) => [...prev, 'torch']);
            setMessage('30ゴールドで火打ち石を購入しました！');
          } else {
            setMessage('ゴールドが足りません。');
          }
        } }
      ]
    },
    treasure: {
      description: '宝を見つけました！ゲームクリアです！',
      options: []
    }
  };

  const handleOption = (option) => {
    if (option.action) {
      option.action();
    } else {
      setLocation(option.location);
    }
  };

  const currentLocation = locations[location];

  return (
    <div className="game-container">
      <div className="game-screen">
        <header>
          <h1>テキストアドベンチャーゲーム</h1>
          <CharacterStatus 
            health={health} 
            mana={mana} 
            gold={gold} 
            setHealth={setHealth} 
            setMana={setMana} 
            setGold={setGold}
          />
          <EventSystem
            location={location}
            inventory={inventory}
            health={health}
            mana={mana}
            setHealth={setHealth}
            setMana={setMana}
            setGold={setGold}
            setInventory={setInventory}
          />
        </header>
        <main>
          <h2>現在の場所: {location}</h2>
          <p>{currentLocation.description}</p>
          <p className="message">{message}</p>
          <div className="options">
            {currentLocation.options.map((option, index) => (
              <button
                key={index}
                onClick={() => handleOption(option)}
                className="option-button"
              >
                {option.text}
              </button>
            ))}
          </div>
          <div className="inventory">
            <h3>持ち物</h3>
            <ul>
              {inventory.map((item, index) => (
                <li key={index}>{item}</li>
              ))}
            </ul>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Game;
