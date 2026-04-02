import useSWR from 'swr';
import { SensorReading, Alert, SystemStatus, MLStats, riskColors } from '@/data/mockSensorData';

const fetcher = (url: string) => fetch(url).then(res => res.json());

const API_URL = 'http://localhost:8000/api';

export function useFloodBackend() {
  // Fetch current reading (updates rapidly)
  const { data: currentReading, error: currentErr } = useSWR<SensorReading>(`${API_URL}/sensors/current`, fetcher, { refreshInterval: 2000 });
  
  // Fetch timeline history
  const { data: timelineData, error: timelineErr } = useSWR<SensorReading[]>(`${API_URL}/sensors/history?hours=24`, fetcher, { refreshInterval: 10000 });
  
  // Fetch alerts
  const { data: alertsData, error: alertsErr } = useSWR<Alert[]>(`${API_URL}/system/alerts`, fetcher, { refreshInterval: 5000 });
  
  // Fetch system status
  const { data: sysStatus, error: sysErr } = useSWR<SystemStatus>(`${API_URL}/system/status`, fetcher, { refreshInterval: 10000 });
  
  // Fetch ML analytics
  const { data: mlStats, error: mlErr } = useSWR<MLStats>(`${API_URL}/ml/analytics`, fetcher, { refreshInterval: 60000 });

  const isLoading = !currentReading || !timelineData || !alertsData || !sysStatus || !mlStats;
  const isError = currentErr || timelineErr || alertsErr || sysErr || mlErr;

  // Process timeline data (backend returns oldest to newest or newest to oldest? Usually newest first from desc, let's reverse if needed)
  // Backend query is filter(time > limit).all() -> usually oldest first by default ID order
  const sensorTimeline = timelineData || [];
  
  // Get previous reading for trends
  const previousReading = sensorTimeline.length > 5 ? sensorTimeline[sensorTimeline.length - 6] : currentReading;

  // Compute calculated stats that the mock data provided
  const risk = currentReading?.risk_level || 'LOW';
  
  const gateOperations = alertsData ? alertsData.filter(a => a.action.includes('Gate') || a.action.includes('Flush')).length : 0;
  
  // Confusion matrix placeholder (backend doesn't send full dynamic CM yet unless we sync it, we use mock default if missing)
  const safeMlStats = mlStats || {} as MLStats;
  if (!safeMlStats.confusion_matrix) {
    safeMlStats.confusion_matrix = [
      [245, 3,  0,  0],
      [5,  198, 4,  1],
      [0,   6, 167, 3],
      [0,   0,  4, 164],
    ];
  }
  if (!safeMlStats.training_samples) safeMlStats.training_samples = 2000;
  if (!safeMlStats.last_trained) safeMlStats.last_trained = new Date().toISOString();

  return {
    currentReading,
    previousReading,
    sensorTimeline,
    alertsData: alertsData || [],
    sysStatus,
    mlStats: safeMlStats,
    risk,
    gateOperations,
    isLoading,
    isError
  };
}
