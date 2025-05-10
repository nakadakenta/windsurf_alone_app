import React from 'react';

const QuestSystem = ({ quests, setQuests, inventory }) => {
  const questsData = {
    'dragon_treasure': {
      title: 'ドラゴンの宝',
      description: '村の伝説によると、森の奥深くにドラゴンが守る宝があるという。',
      requirements: ['torch', 'rope', 'sword'],
      reward: { gold: 100, item: 'dragon_treasure' }
    },
    'village_secret': {
      title: '村の秘密',
      description: '村長から、村の秘密を調査する依頼を受けた。',
      requirements: ['potion', 'village_secret'],
      reward: { gold: 50, item: 'ancient_scroll' }
    }
  };

  const checkQuestCompletion = (questId) => {
    const quest = questsData[questId];
    if (!quest) return false;
    return quest.requirements.every(req => inventory.includes(req));
  };

  const completeQuest = (questId) => {
    const quest = questsData[questId];
    if (!quest) return;
    
    setQuests((prev) => ({
      ...prev,
      [questId]: {
        ...prev[questId],
        completed: true
      }
    }));
    return quest.reward;
  };

  return (
    <div className="quest-section">
      <h2 className="quest-title">クエスト</h2>
      <div className="quest-list">
        {Object.entries(quests).map(([questId, quest]) => {
          const questData = questsData[questId];
          if (!questData) return null;

          const isCompleted = checkQuestCompletion(questId);
          const isAccepted = quest.accepted;

          return (
            <div key={questId} className="quest-item">
              <h3 className="quest-name">{questData.title}</h3>
              <p className="quest-description">{questData.description}</p>
              <div className="quest-requirements">
                <span>必要アイテム: </span>
                <ul>
                  {questData.requirements.map((req, index) => (
                    <li key={index}>
                      <span className={inventory.includes(req) ? 'completed' : ''}>{req}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="quest-actions">
                {!isAccepted && !quest.completed && (
                  <button
                    onClick={() => setQuests((prev) => ({
                      ...prev,
                      [questId]: { ...prev[questId], accepted: true }
                    }))}
                    className="quest-button"
                  >
                    受け入れる
                  </button>
                )}
                {isAccepted && !quest.completed && isCompleted && (
                  <button
                    onClick={() => {
                      const reward = completeQuest(questId);
                      return reward;
                    }}
                    className="quest-button"
                  >
                    完了
                  </button>
                )}
                {quest.completed && (
                  <span className="quest-completed">完了済み</span>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default QuestSystem;
