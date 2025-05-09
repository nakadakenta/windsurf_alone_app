import React from 'react';

const EventSystem = ({ location, inventory, health, mana, setHealth, setMana, setGold, setInventory }) => {
  const events = {
    forest: [
      {
        trigger: 'deepForest',
        condition: () => inventory.includes('torch'),
        effect: () => {
          setMana((prev) => prev - 20);
          setInventory((prev) => [...prev, 'ancient scroll']);
          return '古い巻物を見つけました！しかしMPが減少しました。';
        }
      },
      {
        trigger: 'deepForest',
        condition: () => health < 50,
        effect: () => {
          setHealth((prev) => prev + 30);
          return '森の妖精が現れ、あなたのHPを回復させてくれました！';
        }
      }
    ],
    village: [
      {
        trigger: 'shop',
        condition: () => gold >= 50,
        effect: () => {
          setGold((prev) => prev - 50);
          setInventory((prev) => [...prev, 'potion']);
          return '50ゴールドで回復薬を購入しました！';
        }
      }
    ]
  };

  const triggerEvents = () => {
    const currentEvents = events[location] || [];
    for (const event of currentEvents) {
      if (event.trigger === location && event.condition()) {
        return event.effect();
      }
    }
    return '';
  };

  const eventMessage = triggerEvents();

  return eventMessage ? (
    <div className="event-message">
      <div className="event-icon">✨</div>
      <p>{eventMessage}</p>
    </div>
  ) : null;
};

export default EventSystem;
