import React from 'react';

const SkillSystem = ({ skills, setSkills, level, setLevel }) => {
  const skillPoints = Math.floor(level / 3);
  const availablePoints = skillPoints - Object.values(skills).reduce((a, b) => a + b, 0);

  const upgradeSkill = (skill) => {
    if (skills[skill] < 5 && availablePoints > 0) {
      setSkills((prev) => ({
        ...prev,
        [skill]: prev[skill] + 1
      }));
    }
  };

  return (
    <div className="skill-section">
      <h2 className="skill-title">スキル</h2>
      <div className="skill-info">
        <div className="skill-points">
          <span>スキルポイント: {availablePoints}</span>
          <span>レベル: {level}</span>
        </div>
        <div className="skill-grid">
          {Object.entries(skills).map(([skill, value]) => (
            <div key={skill} className="skill-item">
              <div className="skill-name">{skill}</div>
              <div className="skill-bar">
                <div className="skill-fill" style={{ width: `${value * 20}%` }}></div>
              </div>
              <div className="skill-value">{value}/5</div>
              <button
                onClick={() => upgradeSkill(skill)}
                disabled={value >= 5 || availablePoints <= 0}
                className="skill-button"
              >
                +
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SkillSystem;
