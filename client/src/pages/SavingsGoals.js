import React, { useState, useEffect, useRef } from 'react';
import '../resources/savings.css';
import { Link } from 'react-router-dom';

const SavingsGoals = () => {
  const [goals, setGoals] = useState(() => {
    const savedGoals = localStorage.getItem('savingsGoals');
    return savedGoals ? JSON.parse(savedGoals) : [];
  });
  
  const [newGoal, setNewGoal] = useState({ name: '', target: '', endDate: '' });
  const [editingId, setEditingId] = useState(null);
  const [alert, setAlert] = useState({ show: false, message: '', type: '' });
  const alertRef = useRef(null);
  const formRef = useRef(null);

  // Save goals to localStorage and check for completion
  useEffect(() => {
    localStorage.setItem('savingsGoals', JSON.stringify(goals));
    checkGoalCompletion();
  }, [goals]);

  const scrollToAlert = () => {
    if (alertRef.current) {
      alertRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const scrollToForm = () => {
    if (formRef.current) {
      formRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const checkGoalCompletion = () => {
    goals.forEach(goal => {
      if (goal.saved >= goal.target) {
        showAlert(`🎉 Congratulations! You've completed your "${goal.name}" goal!`, 'success');
      }
    });
  };

  const showAlert = (message, type) => {
    setAlert({ show: true, message, type });
    setTimeout(() => setAlert({ show: false, message: '', type: '' }), 5000);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (editingId) {
      setGoals(goals.map(goal => 
        goal.id === editingId ? { 
          ...goal,
          name: newGoal.name,
          target: parseInt(newGoal.target),
          endDate: newGoal.endDate
        } : goal
      ));
      showAlert('Goal updated successfully!', 'success');
    } else {
      const goal = {
        id: Date.now(),
        ...newGoal,
        saved: 0,
        target: parseInt(newGoal.target)
      };
      setGoals([...goals, goal]);
      showAlert('New goal created successfully!', 'success');
    }
    
    setNewGoal({ name: '', target: '', endDate: '' });
    setEditingId(null);
  };

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this goal?')) {
      setGoals(goals.filter(goal => goal.id !== id));
      showAlert('Goal deleted successfully!', 'info');
    }
  };

  const handleEdit = (goal) => {
    setNewGoal({
      name: goal.name,
      target: goal.target,
      endDate: goal.endDate
    });
    setEditingId(goal.id);
    setTimeout(scrollToForm, 100);
  };

  const handleAddFunds = (id, amount) => {
    if (!amount || isNaN(amount)) {
      showAlert('Please enter a valid amount', 'warning');
      return;
    }
    
    const amountNum = parseInt(amount);
    const updatedGoals = goals.map(goal => 
      goal.id === id ? { ...goal, saved: goal.saved + amountNum } : goal
    );
    
    setGoals(updatedGoals);
    
    const goal = updatedGoals.find(g => g.id === id);
    const newTotal = goal.saved;
    
    if (newTotal >= goal.target) {
      return;
    }
    
    const motivationalMessages = [
      `💪 Great job! ₹${amount} added to your "${goal.name}" goal!`,
      `👍 Awesome! You're making progress on your "${goal.name}" goal!`,
      `🚀 Keep it up! ₹${amount} closer to your "${goal.name}" target!`,
      `✨ Every rupee counts! ₹${amount} added to "${goal.name}"!`
    ];
    
    const randomMessage = motivationalMessages[Math.floor(Math.random() * motivationalMessages.length)];
    showAlert(randomMessage, 'info');
    setTimeout(scrollToAlert, 100);
  };

  return (
    <div className="expense-tracker-container">
      {/* Navigation Bar */}
      <div className="savings-navbar">
        <div className="nav-left">
          <h1>Savings Goals</h1>
        </div>
        <div className="nav-right">
          <Link to="/" className="back-btn">← Back to Expenses</Link>
        </div>
      </div>
      
      <div ref={alertRef}>
        {alert.show && (
          <div className={`alert alert-${alert.type}`}>
            {alert.message}
          </div>
        )}
      </div>

      <div className="content-section">
        <div ref={formRef} className="goal-form">
          <h2>{editingId ? 'Edit Goal' : 'Set New Goal'}</h2>
          <form onSubmit={handleSubmit}>
            <input
              type="text"
              name="name"
              placeholder="Goal Name"
              value={newGoal.name}
              onChange={(e) => setNewGoal({...newGoal, name: e.target.value})}
              required
            />
            <input
              type="number"
              name="target"
              placeholder="Target Amount (₹)"
              value={newGoal.target}
              onChange={(e) => setNewGoal({...newGoal, target: e.target.value})}
              required
            />
            <input
              type="date"
              name="endDate"
              value={newGoal.endDate}
              onChange={(e) => setNewGoal({...newGoal, endDate: e.target.value})}
              required
            />
            <div className="form-actions">
              <button type="submit">
                {editingId ? 'Update Goal' : 'Save Goal'}
              </button>
              {editingId && (
                <button 
                  type="button" 
                  onClick={() => {
                    setNewGoal({ name: '', target: '', endDate: '' });
                    setEditingId(null);
                  }}
                >
                  Cancel
                </button>
              )}
            </div>
          </form>
        </div>

        <div className="goals-table">
          <h2>Your Active Goals</h2>
          {goals.length === 0 ? (
            <p>No goals set yet. Create your first savings goal!</p>
          ) : (
            <table>
              <thead>
                <tr>
                  <th>Goal Name</th>
                  <th>Target</th>
                  <th>Saved</th>
                  <th>Progress</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {goals.map(goal => {
                  const progress = Math.min(100, (goal.saved / goal.target) * 100);
                  const isCompleted = progress >= 100;

                  return (
                    <tr key={goal.id} className={isCompleted ? 'completed' : ''}>
                      <td>{goal.name}</td>
                      <td>₹{goal.target.toLocaleString()}</td>
                      <td>₹{goal.saved.toLocaleString()}</td>
                      <td>
                        <div className="progress-container">
                          <div className="progress-bar">
                            <div 
                              className="progress-fill"
                              style={{ width: `${progress}%` }}
                            ></div>
                          </div>
                          <span className="progress-text">{Math.round(progress)}%</span>
                        </div>
                      </td>
                      <td className="actions">
                        <button 
                          onClick={() => {
                            const amount = prompt('How much to add?');
                            if (amount && !isNaN(amount)) handleAddFunds(goal.id, amount);
                          }}
                        >
                          Add Funds
                        </button>
                        <button onClick={() => handleEdit(goal)}>Edit</button>
                        <button onClick={() => handleDelete(goal.id)}>Delete</button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
};

export default SavingsGoals;