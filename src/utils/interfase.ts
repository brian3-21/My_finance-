

export interface FinancialChartProps{
  dataChart:MoneyUser,
}

export interface MoneyUser {
  id:string,
  short_term: number;
  medium_term: number;
  long_term: number;
  
}
