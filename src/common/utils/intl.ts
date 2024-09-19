export const formatCurrency = (value: number) => {
  return value.toLocaleString('es-HN', { style: 'currency', currency: 'HNL' })
}
