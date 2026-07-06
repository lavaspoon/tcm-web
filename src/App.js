import { useState } from 'react';
import './App.css';
import ManagerDashboard from './components/ManagerDashboard';
import MemberView from './components/MemberView';

function App() {
  const [role, setRole] = useState('manager');

  return (
    <div className="app">
      <div className="topbar">
        <div className="brand">
          <span className="logo">T</span>
          TDS 필수안내
          <span className="sub">인바운드 상담 품질 코칭</span>
        </div>
        <div className="role-toggle">
          <button
            className={role === 'manager' ? 'active' : ''}
            onClick={() => setRole('manager')}
          >
            실장
          </button>
          <button
            className={role === 'member' ? 'active' : ''}
            onClick={() => setRole('member')}
          >
            상담사
          </button>
        </div>
      </div>

      {role === 'manager' ? <ManagerDashboard /> : <MemberView />}
    </div>
  );
}

export default App;
