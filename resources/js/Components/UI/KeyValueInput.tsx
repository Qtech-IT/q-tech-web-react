import { Button } from '@/Components/UI/Button';
import { Input } from '@/Components/UI/Input';
import { useTranslations } from '@/Hooks/useTranslations';
import { Copy, Plus, X } from 'lucide-react';
import { useState } from 'react';

interface KeyValuePair {
  key: string;
  value: string;
}

interface KeyValueInputProps {
  value: Record<string, string> | null | undefined;
  onChange: (value: Record<string, string>) => void;
  disabled?: boolean;
  error?: string;
  placeholder?: string;
}

export function KeyValueInput({
  value = {},
  onChange,
  disabled = false,
  error,
  placeholder = 'Add option',
}: any) {
  const { t } = useTranslations();
  const [newKey, setNewKey] = useState('');
  const [newValue, setNewValue] = useState('');
  const [editingKey, setEditingKey] = useState<string | null>(null);

  // Convert object to array for easier manipulation
  const pairs: any[] = Object.entries(value || {}).map(([k, v]) => ({
    key: k,
    value: v,
  }));

  const addPair = () => {
    if (newKey.trim() && newValue.trim()) {
      const updated = {
        ...value,
        [newKey.trim()]: newValue.trim(),
      };
      onChange(updated);
      setNewKey('');
      setNewValue('');
    }
  };

  const removePair = (key: string) => {
    const updated = { ...value };
    delete updated[key];
    onChange(updated);
    if (editingKey === key) {
      setEditingKey(null);
    }
  };

  const updatePair = (oldKey: string, newKeyVal: string, newValueVal: string) => {
    if (!newKeyVal.trim() || !newValueVal.trim()) return;

    const updated = { ...value };
    delete updated[oldKey];
    updated[newKeyVal.trim()] = newValueVal.trim();
    onChange(updated);
    setEditingKey(null);
  };

  const duplicatePair = (key: string) => {
    let counter = 1;
    let newKey = `${key}_copy`;
    while (value && value[newKey]) {
      counter++;
      newKey = `${key}_copy_${counter}`;
    }
    const updated = {
      ...value,
      [newKey]: value![key],
    };
    onChange(updated as any);
  };

  return (
    <div className="space-y-4">
      {/* Input Section */}
      <div className="space-y-3 p-4 border rounded-lg bg-gray-50/50 dark:bg-gray-900/30">
        <div className="grid grid-cols-2 gap-2">
          <div>
            <label className="text-xs font-medium text-gray-600 dark:text-gray-400 mb-1 block">
              {t('Label')}
            </label>
            <Input
              placeholder={t('e.g., 1, option_1')}
              value={newKey}
              onChange={(e) => setNewKey(e.target.value)}
              disabled={disabled}
              onKeyPress={(e) => e.key === 'Enter' && addPair()}
              className="text-sm"
            />
          </div>
          <div>
            <label className="text-xs font-medium text-gray-600 dark:text-gray-400 mb-1 block">
              {t('Value')}
            </label>
            <Input
              placeholder={t('e.g., Option 1')}
              value={newValue}
              onChange={(e) => setNewValue(e.target.value)}
              disabled={disabled}
              onKeyPress={(e) => e.key === 'Enter' && addPair()}
              className="text-sm"
            />
          </div>
        </div>
        <Button
          type="button"
          onClick={addPair}
          disabled={disabled || !newKey.trim() || !newValue.trim()}
          size="sm"
          className="w-full"
        >
          <Plus className="w-4 h-4 mr-2" />
          {t('Add Option')}
        </Button>
      </div>

      {/* Error Message */}
      {error && (
        <p className="text-sm font-medium text-destructive">{error}</p>
      )}

      {/* Display Pairs */}
      {pairs.length > 0 ? (
        <div className="space-y-2">
          <div className="text-xs font-medium text-gray-600 dark:text-gray-400">
            {t('Added Options')} ({pairs.length})
          </div>
          <div className="space-y-2 max-h-80 overflow-y-auto">
            {pairs.map((pair) => (
              <div
                key={pair.key}
                className={`p-3 border rounded-lg transition-all ${editingKey === pair.key
                  ? 'bg-blue-50 dark:bg-blue-900/20 border-blue-300 dark:border-blue-700'
                  : 'bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700'
                  }`}
              >
                {editingKey === pair.key ? (
                  <div className="space-y-2">
                    <div className="grid grid-cols-2 gap-2">
                      <Input
                        defaultValue={pair.key}
                        placeholder={t('Label')}
                        disabled={disabled}
                        className="text-sm"
                        id={`key-${pair.key}`}
                      />
                      <Input
                        defaultValue={pair.value}
                        placeholder={t('Value')}
                        disabled={disabled}
                        className="text-sm"
                        id={`value-${pair.key}`}
                      />
                    </div>
                    <div className="flex gap-2">
                      <Button
                        type="button"
                        size="sm"
                        variant="default"
                        onClick={() => {
                          const keyInput = document.getElementById(
                            `key-${pair.key}`
                          ) as HTMLInputElement;
                          const valueInput = document.getElementById(
                            `value-${pair.key}`
                          ) as HTMLInputElement;
                          updatePair(pair.key, keyInput.value, valueInput.value);
                        }}
                        disabled={disabled}
                        className="flex-1"
                      >
                        {t('Save')}
                      </Button>
                      <Button
                        type="button"
                        size="sm"
                        variant="outline"
                        onClick={() => setEditingKey(null)}
                        disabled={disabled}
                        className="flex-1"
                      >
                        {t('Cancel')}
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="text-xs font-semibold text-gray-600 dark:text-gray-400">
                        {pair.key}
                      </div>
                      <div className="text-sm text-gray-900 dark:text-gray-100">
                        {pair.value}
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <button
                        type="button"
                        onClick={() => duplicatePair(pair.key)}
                        disabled={disabled}
                        className="p-2 hover:bg-blue-100 dark:hover:bg-blue-900/30 rounded transition-colors text-blue-600 dark:text-blue-400"
                        title={t('Duplicate')}
                      >
                        <Copy className="w-4 h-4" />
                      </button>
                      <button
                        type="button"
                        onClick={() => setEditingKey(pair.key)}
                        disabled={disabled}
                        className="p-2 hover:bg-yellow-100 dark:hover:bg-yellow-900/30 rounded transition-colors text-yellow-600 dark:text-yellow-400"
                        title={t('Edit')}
                      >
                        <span className="text-sm font-medium">✎</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => removePair(pair.key)}
                        disabled={disabled}
                        className="p-2 hover:bg-red-100 dark:hover:bg-red-900/30 rounded transition-colors text-red-600 dark:text-red-400"
                        title={t('Delete')}
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="p-4 text-center text-sm text-gray-500 dark:text-gray-400 border border-dashed rounded-lg">
          {t('No options added yet. Add options above to get started.')}
        </div>
      )}

      {/* Preview JSON */}
      {pairs.length > 0 && (
        <div className="p-3 bg-gray-100 dark:bg-gray-800 rounded border border-gray-200 dark:border-gray-700">
          <div className="text-xs font-semibold text-gray-600 dark:text-gray-400 mb-2">
            {t('JSON Preview')}
          </div>
          <code className="text-xs text-gray-700 dark:text-gray-300 break-words overflow-auto block">
            {JSON.stringify(value, null, 2)}
          </code>
        </div>
      )}
    </div>
  );
}

export default KeyValueInput;