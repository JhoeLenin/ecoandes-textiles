// Enums del módulo SCM (gestión de la cadena de suministro).

export const ESTADO_PROVEEDOR = ['activo', 'inactivo'];

// Estados de una orden de compra a proveedor.
export const ESTADO_OC = ['solicitado', 'aprobado', 'recibido', 'rechazado'];

export const ESTADO_OC_LABEL = {
  solicitado: 'Solicitado',
  aprobado: 'Aprobado',
  recibido: 'Recibido',
  rechazado: 'Rechazado',
};

// Punto de reorden por defecto: si el stock cae a este valor o menos, se alerta.
export const REORDER_POINT = 10;
