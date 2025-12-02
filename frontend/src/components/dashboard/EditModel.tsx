import { useEffect, useState } from 'react';

interface EditModalProps<T> {
  title: string;
  isOpen: boolean;
  data?: Partial<T>;
  fields: FieldConfig[];
  isLoading: boolean;
  onSave: (data: Partial<T>) => void;
  onClose: () => void;
}

export interface FieldConfig {
  name: string;
  label: string;
  type: 'text' | 'number' | 'select' | 'checkbox';
  options?: { value: string; label: string }[];
  required?: boolean;
}

function EditModal<T extends Record<string, any>>({
  title,
  isOpen,
  data,
  fields,
  isLoading,
  onSave,
  onClose,
}: EditModalProps<T>) {
  const [formData, setFormData] = useState<Partial<T>>({});

  useEffect(() => {
    if (isOpen) {
      // Reset form data when modal opens
      if (data) {
        setFormData(data);
      } else {
        // If no data provided, start with empty form
        setFormData({});
      }
    }
  }, [data, isOpen]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'number' ? Number(value) : type === 'checkbox' ? (e.target as HTMLInputElement).checked : value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-md w-full">
        <h2 className="text-2xl font-bold mb-4">{title}</h2>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          {fields.map(field => (
            <div key={field.name}>
              <label className="block text-sm font-semibold mb-1">{field.label}</label>
              
              {field.type === 'checkbox' ? (
                <input
                  type="checkbox"
                  name={field.name}
                  checked={(formData[field.name as keyof T] as boolean) || false}
                  onChange={handleChange}
                  className="w-4 h-4"
                />
              ) : field.type === 'select' ? (
                <select
                  name={field.name}
                  value={(formData[field.name as keyof T] as string) || ''}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded px-3 py-2"
                >
                  <option value="">Select {field.label}</option>
                  {field.options?.map(opt => (
                    <option key={opt.value} value={opt.value}>
                      {opt.label}
                    </option>
                  ))}
                </select>
              ) : (
                <input
                  type={field.type}
                  name={field.name}
                  value={(formData[field.name as keyof T] as string | number) || ''}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded px-3 py-2"
                />
              )}
            </div>
          ))}

          <div className="flex gap-2 pt-4">
            <button
              type="submit"
              disabled={isLoading}
              className="flex-1 bg-blue-600 text-white py-2 rounded hover:bg-blue-700 disabled:bg-gray-400"
            >
              {isLoading ? 'Saving...' : 'Save'}
            </button>
            <button
              type="button"
              onClick={onClose}
              className="flex-1 bg-gray-300 text-black py-2 rounded hover:bg-gray-400"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default EditModal;