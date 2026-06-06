import { supabase } from '../../../lib/supabase';

const empresa_id =
  '1427c107-6e37-44fa-8984-cdf39a5b9a62';

export interface DashboardStats {
  clientes: number;
  vehiculos: number;
  recepciones: number;
  ordenes: number;
}

const countTable = async (
  table: string
) => {
  const { count, error } =
    await supabase
      .from(table)
      .select('*', {
        count: 'exact',
        head: true,
      })
      .eq('empresa_id', empresa_id);

  if (error) throw error;

  return count || 0;
};

export const getDashboardStats =
  async (): Promise<DashboardStats> => {
    const [
      clientes,
      vehiculos,
      recepciones,
      ordenes,
    ] = await Promise.all([
      countTable('clientes'),

      countTable('vehiculos'),

      countTable('recepciones'),

      countTable('ordenes_trabajo'),
    ]);

    return {
      clientes,
      vehiculos,
      recepciones,
      ordenes,
    };
  };

export const getRecentActivity = () => {
  return [
    {
      title: 'Nueva recepción registrada',

      description:
        'Toyota Corolla 2022 ingresó a taller',

      time: 'Hace 5 minutos',
    },

    {
      title: 'Orden de trabajo creada',

      description:
        'OT #000245 asignada a producción',

      time: 'Hace 18 minutos',
    },

    {
      title: 'Vehículo entregado',

      description:
        'Mazda CX5 entregado al cliente',

      time: 'Hace 42 minutos',
    },

    {
      title: 'Nuevo cliente registrado',

      description:
        'Cliente corporativo agregado',

      time: 'Hace 1 hora',
    },
  ];
};