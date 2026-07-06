import {
  CATEGORIES,
  CURRENT_MEMBER,
  COACHING_HISTORY,
} from '../data/mockData';
import { scoreColor, initials } from '../utils';

function Ring({ pct }) {
  const size = 116;
  const stroke = 11;
  const r = (size - stroke) / 2;
  const circ = 2 * Math.PI * r;
  const offset = circ * (1 - pct / 100);
  const color = scoreColor(pct);
  return (
    <div className="ring-wrap">
      <svg width={size} height={size}>
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          stroke="#eef0f3"
          strokeWidth={stroke}
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          stroke={color}
          strokeWidth={stroke}
          strokeLinecap="round"
          strokeDasharray={circ}
          strokeDashoffset={offset}
          transform={`rotate(-90 ${size / 2} ${size / 2})`}
          style={{ transition: 'stroke-dashoffset 0.6s ease' }}
        />
      </svg>
      <div className="center">
        <div className="pct" style={{ color }}>{pct}%</div>
        <div className="cap">이행률</div>
      </div>
    </div>
  );
}

function RingCard({ category }) {
  const m = CURRENT_MEMBER;
  const pct = m.scores[category.key];
  return (
    <div className="ring-card card">
      <div className="cat-name">{category.name}</div>
      <Ring pct={pct} />
      <div className="detail">
        {category.items.map((it) => {
          const v = m.itemScores[it.key];
          return (
            <div className="row" key={it.key}>
              <span className="item-n">{it.name}</span>
              <span className="item-v" style={{ color: scoreColor(v) }}>
                {v}%
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

const STATUS_PILL = {
  '확인': 'neutral',
  '개선 확인됨': 'good',
  '완료': 'good',
};

export default function MemberView() {
  const m = CURRENT_MEMBER;
  return (
    <div className="page">
      <div className="page-hero">
        <div>
          <div className="eyebrow">상담사 화면</div>
          <h1>내 필수안내 현황</h1>
        </div>
        <div className="date">2026-07-06 통화분 기준</div>
      </div>

      <div className="member-hero card">
        <div className="big-avatar">{initials(m.name)}</div>
        <div>
          <div className="greet">{m.name}님, 어제 {m.calls}건 상담하셨어요</div>
          <div className="greet-sub">
            계약 조건 안내에서 조금만 더 챙기면 완벽해요.
          </div>
        </div>
        <div className="note">
          이 화면은 참고용이에요. 매번 확인하지 않아도 코칭이 오면 알려드려요.
        </div>
      </div>

      <div className="section-head">
        <h2>대분류별 이행률</h2>
        <span className="hint">세부 항목까지 펼쳐서 볼 수 있어요</span>
      </div>
      <div className="rings">
        {CATEGORIES.map((c) => (
          <RingCard key={c.key} category={c} />
        ))}
      </div>

      <div className="section-head">
        <h2>받은 코칭 히스토리</h2>
        <span className="hint">실장님이 보낸 코칭 기록이에요</span>
      </div>
      <div className="card history-list">
        {COACHING_HISTORY.map((h) => (
          <div className="history-item" key={h.id}>
            <div className="dot" />
            <div>
              <div className="topic">{h.topic}</div>
              <div className="msg">{h.message}</div>
              <span
                className={`pill ${STATUS_PILL[h.status] || 'neutral'}`}
                style={{ marginTop: 8 }}
              >
                {h.status}
              </span>
            </div>
            <div className="side">
              <div className="d">{h.date}</div>
              <div className="f">{h.from}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
