import { useState } from 'react';
import {
  CATEGORIES,
  CONSULTANTS,
  TEAM_PATTERNS,
  COACHING_DRAFTS,
  TEAM_SUMMARY,
  ASK_SUGGESTIONS,
  ASK_ANSWERS,
} from '../data/mockData';
import { scoreColor } from '../utils';

const CAUSE_STYLE = {
  learning: { cls: 'bad', label: '학습 부족' },
  habit: { cls: 'warn', label: '습관성' },
  mistake: { cls: 'neutral', label: '단순 실수' },
};

const won = (n) => n.toLocaleString('ko-KR');

/* ── 상단: AI 브리핑 히어로 ───────────────────────────── */
function BriefingHero({ total, done }) {
  const w = TEAM_SUMMARY.aiWorkload;
  const remaining = total - done;
  return (
    <div className="brief-hero card">
      <div className="brief-top">
        <span className="brief-badge">
          <span className="dot-live" /> AI 브리핑
        </span>
        <span className="brief-date">{TEAM_SUMMARY.date} 통화분 · 오늘 새벽 자동 분석 완료</span>
      </div>

      <p className="brief-text">{TEAM_SUMMARY.aiBriefing}</p>

      <div className="brief-stats">
        <div className="bs">
          <div className="bs-num">{w.callsListened}건</div>
          <div className="bs-cap">AI가 전수 청취·분석</div>
        </div>
        <div className="bs">
          <div className="bs-num">{Math.floor(w.minutesSaved / 60)}시간 {w.minutesSaved % 60}분</div>
          <div className="bs-cap">사람이 들었다면 걸릴 시간</div>
        </div>
        <div className="bs">
          <div className="bs-num">{w.draftsWritten}건</div>
          <div className="bs-cap">코칭 초안 자동 작성</div>
        </div>
        <div className="bs accent">
          <div className="bs-num">{won(w.penaltyGuarded)}원</div>
          <div className="bs-cap">방어 가능한 보상비</div>
        </div>
      </div>

      <div className="brief-cta">
        오늘 코칭할 상담사 <b>{remaining}명</b> · 위에서부터 처리하면 됩니다
        <span className="brief-progress">{done}/{total} 완료</span>
      </div>
    </div>
  );
}

/* ── AI에게 물어보기 (자연어 검색) ────────────────────── */
function AskBar() {
  const [q, setQ] = useState('');
  const [answer, setAnswer] = useState(null);

  const ask = (text) => {
    setQ(text);
    setAnswer(ASK_ANSWERS[text] || 'AI가 관련 데이터를 찾고 있어요… (데모에서는 예시 질문을 눌러보세요)');
  };

  return (
    <div className="ask card">
      <div className="ask-row">
        <span className="ask-icon">✦</span>
        <input
          className="ask-input"
          placeholder="AI에게 물어보세요 — 예: 이번 주 가장 위험한 상담사는?"
          value={q}
          onChange={(e) => setQ(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && ask(q)}
        />
        <button className="btn primary" onClick={() => ask(q)}>질문</button>
      </div>
      <div className="ask-suggest">
        {ASK_SUGGESTIONS.map((s) => (
          <button key={s} className="ask-chip" onClick={() => ask(s)}>{s}</button>
        ))}
      </div>
      {answer && (
        <div className="ask-answer">
          <span className="aa-badge">AI 답변</span>
          <p>{answer}</p>
        </div>
      )}
    </div>
  );
}

/* ── 통화 재구성 타임라인 ─────────────────────────────── */
function Replay({ replay }) {
  return (
    <div className="replay">
      <div className="replay-head">
        <span className="replay-title">🎧 AI가 재구성한 통화</span>
        <span className="replay-id">{replay.callId}</span>
      </div>
      <div className="timeline">
        {replay.steps.map((s, i) => (
          <div key={i} className={`tl-step ${s.who} ${s.gap ? 'gap' : ''}`}>
            <span className="tl-time">{s.t}</span>
            <span className={`tl-marker ${s.ok === true ? 'ok' : s.ok === false ? 'no' : 'neutral'}`}>
              {s.ok === true ? '✓' : s.ok === false ? '✕' : '·'}
            </span>
            <span className="tl-body">
              <span className="tl-text">
                <em>{s.who === 'agent' ? '상담사' : '고객'}</em> "{s.text}"
              </span>
              <span className={`tl-label ${s.gap ? 'miss' : ''}`}>{s.label}</span>
            </span>
          </div>
        ))}
      </div>
      <div className="replay-note">
        <b>AI 해석</b> {replay.aiNote}
      </div>
    </div>
  );
}

/* ── 개선 시뮬레이션 게이지 ───────────────────────────── */
function ImpactSim({ impact }) {
  const gain = impact.predictedRate - impact.currentRate;
  return (
    <div className="impact">
      <div className="impact-title">이 코칭을 보내면 (AI 예측)</div>
      <div className="impact-body">
        <div className="impact-gauge">
          <div className="ig-track">
            <div className="ig-cur" style={{ width: `${impact.currentRate}%` }} />
            <div
              className="ig-gain"
              style={{ left: `${impact.currentRate}%`, width: `${gain}%` }}
            />
          </div>
          <div className="ig-labels">
            <span>현재 <b>{impact.currentRate}%</b></span>
            <span className="ig-arrow">→</span>
            <span className="ig-pred">다음 주 <b>{impact.predictedRate}%</b> 예상</span>
          </div>
          <div className="ig-basis">{impact.basis} · {impact.confidence}</div>
        </div>
        <div className="impact-money">
          <div className="im-num">{won(impact.penaltyGuard)}원</div>
          <div className="im-cap">월 보상비 감소<br />방어 예상</div>
        </div>
      </div>
    </div>
  );
}

/* ── 지난 코칭 효과 추적 (before/after) ──────────────── */
function CoachingEffect({ last }) {
  return (
    <div className={`effect ${last.verdict}`}>
      <span className="effect-icon">📈</span>
      <span className="effect-body">
        <span className="effect-line">
          지난 코칭 <b>{last.topic}</b> ({last.date})
          <span className="effect-delta">
            {last.before}% <span className="ed-arrow">→</span> <b>{last.after}%</b>
          </span>
        </span>
        <span className="effect-note">{last.aiNote}</span>
      </span>
    </div>
  );
}

/* ── 메인: 위험 순 액션 카드 ──────────────────────────── */
function ActionCard({ item, rank, done, onSend, expanded, onToggle }) {
  const cause = CAUSE_STYLE[item.causeType];
  return (
    <div className={`action-card card ${done ? 'is-done' : ''} ${expanded ? 'is-open' : ''}`}>
      <button className="action-summary" onClick={onToggle}>
        <span className="rank">{done ? '✓' : rank}</span>
        <span className="ac-who">
          <span className="ac-name">
            {item.consultant}
            {item.lastCoaching && <span className="ac-badge">재코칭</span>}
          </span>
          <span className="ac-headline">{item.headline}</span>
        </span>
        <span className="ac-metrics">
          <span className={`pill ${cause.cls}`}>{cause.label}</span>
          <span className="ac-miss">
            <b>{item.missRate}%</b> 미이행
            <em>{item.calls}건 중</em>
          </span>
        </span>
        <span className="ac-chevron">{expanded ? '▲' : '▼'}</span>
      </button>

      {expanded && (
        <div className="action-detail">
          {item.lastCoaching && <CoachingEffect last={item.lastCoaching} />}

          <Replay replay={item.replay} />

          <div className="cause-line">
            추정 원인 · <b>{item.cause}</b>
          </div>

          <div className="draft-box">
            <span className="tag">AI 코칭 초안 · {item.tone}</span>
            <p>{item.draft}</p>
          </div>

          <ImpactSim impact={item.impact} />

          <div className="coach-actions">
            {item.causeType === 'learning' && (
              <button className="btn ghost">📚 재교육 콘텐츠 연계</button>
            )}
            <button className="btn">✎ 수정</button>
            <button
              className={`btn primary ${done ? 'sent' : ''}`}
              onClick={onSend}
            >
              {done ? '✓ 전송됨' : '메신저로 전송'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

function ActionList({ sentIds, openId, onSend, onToggle }) {
  return (
    <>
      <div className="secondary-label main">오늘의 코칭 · 위험 순</div>
      <div className="action-list">
        {COACHING_DRAFTS.map((d, i) => (
          <ActionCard
            key={d.id}
            item={d}
            rank={i + 1}
            done={sentIds.includes(d.id)}
            expanded={openId === d.id}
            onSend={() => onSend(d.id)}
            onToggle={() => onToggle(d.id)}
          />
        ))}
      </div>
    </>
  );
}

/* ── 보조: 팀 패턴 (접이식) ───────────────────────────── */
function TeamPatterns() {
  const [open, setOpen] = useState(false);
  return (
    <div className="collapsible card">
      <button className="collapsible-head" onClick={() => setOpen((o) => !o)}>
        <span>
          <span className="ch-title">팀 반복 패턴 {TEAM_PATTERNS.length}건</span>
          <span className="ch-sub">개인 코칭과 별개로, 팀 전체에 공통된 미이행 유형</span>
        </span>
        <span className="ch-chevron">{open ? '▲' : '▼'}</span>
      </button>
      {open && (
        <div className="collapsible-body pattern-list">
          {TEAM_PATTERNS.map((p) => (
            <div key={p.id} className={`mini-pattern ${p.severity}`}>
              <span className="mp-accent" />
              <div className="mp-body">
                <div className="mp-title">{p.title}</div>
                <div className="mp-insight">{p.insight}</div>
              </div>
              <div className="mp-cov">{p.coverage}%</div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

/* ── 보조: 전체 히트맵 (접이식) ───────────────────────── */
function Heatmap() {
  const [open, setOpen] = useState(false);
  return (
    <div className="collapsible card">
      <button className="collapsible-head" onClick={() => setOpen((o) => !o)}>
        <span>
          <span className="ch-title">전체 상담사 이행 현황</span>
          <span className="ch-sub">대분류 3개 기준 · 참고용 전수 데이터</span>
        </span>
        <span className="ch-chevron">{open ? '▲' : '▼'}</span>
      </button>
      {open && (
        <div className="collapsible-body heatmap">
          <table className="heat-table">
            <thead>
              <tr>
                <th className="name-col">상담사</th>
                {CATEGORIES.map((c) => (
                  <th key={c.key}>{c.name}</th>
                ))}
                <th>주간 추이</th>
              </tr>
            </thead>
            <tbody>
              {CONSULTANTS.map((c) => (
                <tr key={c.id}>
                  <td className="name-col">
                    {c.name}
                    <span className="calls">{c.calls}건</span>
                  </td>
                  {CATEGORIES.map((cat) => {
                    const v = c.scores[cat.key];
                    return (
                      <td key={cat.key}>
                        <div className="heat-cell" style={{ background: scoreColor(v) }}>
                          {v}%
                        </div>
                      </td>
                    );
                  })}
                  <td className={`trend-cell ${c.trend >= 0 ? 'up' : 'down'}`}>
                    {c.trend >= 0 ? '▲' : '▼'} {Math.abs(c.trend)}%p
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default function ManagerDashboard() {
  const [sentIds, setSentIds] = useState([]);
  const [openId, setOpenId] = useState(COACHING_DRAFTS[0]?.id ?? null);

  const handleSend = (id) => {
    setSentIds((prev) => (prev.includes(id) ? prev : [...prev, id]));
    const next = COACHING_DRAFTS.find(
      (d) => d.id !== id && !sentIds.includes(d.id)
    );
    setOpenId(next ? next.id : null);
  };

  const handleToggle = (id) => setOpenId((cur) => (cur === id ? null : id));

  return (
    <div className="page">
      <BriefingHero total={COACHING_DRAFTS.length} done={sentIds.length} />
      <AskBar />
      <ActionList
        sentIds={sentIds}
        openId={openId}
        onSend={handleSend}
        onToggle={handleToggle}
      />

      <div className="secondary-label">참고 자료</div>
      <TeamPatterns />
      <Heatmap />
    </div>
  );
}
