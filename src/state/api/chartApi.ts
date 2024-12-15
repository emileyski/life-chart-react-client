import { createApi } from '@reduxjs/toolkit/query/react';
import { baseQueryWithReauth } from './authApi';
// const
//   '7_DAYS' = '7 days',
//   THIS_WEEK = 'this week',
//   '30_DAYS' = '30 days',
//   THIS_MONTH = 'this month',
//   MAX = 'max',
export interface ChartData {
  position: [number | null, number | null];
  date: string;
}

export type chartTimeRanges =
  | '7 days'
  | 'this week'
  | '30 days'
  | 'this month'
  | 'max';
export const chartApi = createApi({
  reducerPath: 'chartApi',
  baseQuery: baseQueryWithReauth,
  endpoints: (builder) => ({
    getChartData: builder.query<ChartData[], chartTimeRanges>({
      query: (timeRange) => ({
        url: `chart?timeRange=${timeRange}`,
        method: 'GET',
      }),
    }),
  }),
});

export const { useGetChartDataQuery } = chartApi;
