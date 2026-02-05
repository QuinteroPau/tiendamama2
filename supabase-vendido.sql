-- Ejecuta este SQL en el editor SQL de tu proyecto Supabase (Dashboard → SQL Editor)
-- para añadir la columna "vendido" a la tabla productos.

ALTER TABLE productos
ADD COLUMN IF NOT EXISTS vendido boolean DEFAULT false;

-- Opcional: si la columna ya existía sin default, actualiza filas existentes:
-- UPDATE productos SET vendido = false WHERE vendido IS NULL;
