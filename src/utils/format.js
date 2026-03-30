/** ₮1'234'567 форматтай болгох */
export const formatMNT = (amount) => {
  if (!amount && amount !== 0) return '—';
  return `${Number(amount).toLocaleString('en-US').replace(/,/g, "'")}₮`;
};

/** ₩1,234,567 форматтай болгох */
export const formatKRW = (amount) => {
  if (!amount && amount !== 0) return '—';
  return `${Number(amount).toLocaleString('ko-KR')}₩`;
};

/** 104,800км */
export const formatKm = (km) => {
  if (!km && km !== 0) return '—';
  return `${Number(km).toLocaleString('en-US')}км`;
};

/** Машины нас */
export const getCarAge = (year) => {
  if (!year) return '—';
  return `${new Date().getFullYear() - year} жил`;
};

/** Богино форматтай CC */
export const formatCC = (cc) => {
  if (!cc) return '—';
  return `${cc}сс`;
};
