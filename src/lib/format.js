export function onlyDigits(value = "") { return String(value).replace(/\D/g, ""); }
export function formatCNPJ(value = "") {
  const digits = onlyDigits(value).slice(0, 14);
  return digits.replace(/^(\d{2})(\d)/, "$1.$2").replace(/^(\d{2})\.(\d{3})(\d)/, "$1.$2.$3").replace(/\.(\d{3})(\d)/, ".$1/$2").replace(/(\d{4})(\d)/, "$1-$2");
}
export function formatDateTime(value) { if (!value) return "-"; try { return new Date(value).toLocaleString("pt-BR"); } catch { return value; } }

