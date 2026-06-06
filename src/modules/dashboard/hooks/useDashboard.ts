import { useEffect, useState } from 'react';

import {
  DashboardStats,
  getDashboardStats,
  getRecentActivity,
} from '../services/dashboardService';

export const useDashboard = () => {
  const [loading, setLoading] =
    useState(true);

  const [stats, setStats] =
    useState<DashboardStats>({
      clientes: 0,
      vehiculos: 0,
      recepciones: 0,
      ordenes: 0,
    });

  const [recentActivity] = useState(
    getRecentActivity()
  );

  const loadDashboard = async () => {
    setLoading(true);

    try {
      const dashboardStats =
        await getDashboardStats();

      setStats(dashboardStats);
    } catch (error) {
      console.error(
        'Error cargando dashboard:',
        error
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDashboard();
  }, []);

  return {
    loading,
    stats,
    recentActivity,
    reload: loadDashboard,
  };
};