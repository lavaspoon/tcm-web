// 이행률(%)을 히트맵 배경색으로 매핑 — 낮을수록 빨강, 높을수록 초록
export function scoreColor(pct) {
  if (pct >= 90) return '#2eb872';
  if (pct >= 80) return '#7cc576';
  if (pct >= 70) return '#f5a623';
  if (pct >= 60) return '#f0803c';
  return '#f04452';
}

export function initials(name) {
  // 한글 이름은 성을 제외한 이름 첫 글자, 아니면 첫 글자
  return name.length >= 2 ? name.slice(1) : name;
}
