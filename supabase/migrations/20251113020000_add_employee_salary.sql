-- Add salary field to employee table
ALTER TABLE employee ADD COLUMN IF NOT EXISTS salary DECIMAL(12,2) DEFAULT 0.00;

-- Verify the column was added
SELECT column_name, data_type, column_default
FROM information_schema.columns 
WHERE table_name = 'employee' AND column_name = 'salary';
