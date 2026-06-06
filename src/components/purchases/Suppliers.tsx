import React from 'react';

/**
 * Componente temporal de compatibilidad.
 *
 * Suppliers.tsx no pertenece al MVP actual de GESTBOX.
 * Será útil cuando se implemente inventario/compras, pero el archivo actual
 * no forma parte del flujo principal:
 * Clientes → Vehículos → Recepción → Órdenes de Trabajo.
 *
 * Cuando se reconstruya, debe conectarse a una tabla real:
 * proveedores
 *
 * Se mantiene vacío para evitar errores si algún archivo antiguo todavía lo importa.
 */
const Suppliers: React.FC = () => {
  return null;
};

export default Suppliers;
