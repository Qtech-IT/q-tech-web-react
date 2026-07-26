import React, { useState, useMemo } from 'react';
import { Plus, X, AlertCircle } from 'lucide-react';
import { Input } from '@/Components/UI/Input';
import { Button } from '@/Components/UI/Button';
import { useTranslations } from '@/Hooks/useTranslations';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/Components/UI/Select';
import { Badge } from '@/Components/UI/Badge';

interface ValidationRulesInputProps {
  value: Record<string, any> | null | undefined;
  onChange: (value: Record<string, any>) => void;
  disabled?: boolean;
  error?: string;
  inputType?: string;
}

const LARAVEL_RULE_MAP: Record<string, string> = {
  minLength: 'min',
  maxLength: 'max',
  minItems: 'min',
  maxItems: 'max',
  pattern: 'regex',
};

const RULES_BY_INPUT_TYPE: Record<string, Array<{
  rule: string;
  label: string;
  valueType: 'none' | 'number' | 'string' | 'boolean';
  description: string;
  placeholder?: string;
}>> = {
  text: [
    { rule: 'required', label: 'Required', valueType: 'none', description: 'Field must have a value' },
    { rule: 'min', label: 'Minimum Length', valueType: 'number', description: 'Minimum characters', placeholder: '3' },
    { rule: 'max', label: 'Maximum Length', valueType: 'number', description: 'Maximum characters', placeholder: '100' },
    { rule: 'regex', label: 'Pattern (Regex)', valueType: 'string', description: 'Regex pattern' },
  ],
  email: [
    { rule: 'required', label: 'Required', valueType: 'none', description: 'Email is required' },
    { rule: 'email', label: 'Valid Email', valueType: 'none', description: 'Must be a valid email address' },
  ],
  number: [
    { rule: 'required', label: 'Required', valueType: 'none', description: 'Field must have a value' },
    { rule: 'numeric', label: 'Numeric', valueType: 'none', description: 'Must be a number' },
    { rule: 'min', label: 'Minimum Value', valueType: 'number', description: 'Minimum allowed value', placeholder: '0' },
    { rule: 'max', label: 'Maximum Value', valueType: 'number', description: 'Maximum allowed value', placeholder: '100' },
  ],
  textarea: [
    { rule: 'required', label: 'Required', valueType: 'none', description: 'Field must have a value' },
    { rule: 'min', label: 'Minimum Length', valueType: 'number', description: 'Minimum characters', placeholder: '10' },
    { rule: 'max', label: 'Maximum Length', valueType: 'number', description: 'Maximum characters', placeholder: '1000' },
  ],
  select: [
    { rule: 'required', label: 'Required', valueType: 'none', description: 'Selection is required' },
    { rule: 'in', label: 'Allowed Values', valueType: 'string', description: 'Comma-separated allowed values', placeholder: 'a,b,c' },
  ],
 'multi-select': [
  { rule: 'required', label: 'Required', valueType: 'none', description: 'At least one option required' },
  { rule: 'array', label: 'Array', valueType: 'none', description: 'Must be an array' },
  { rule: 'min', label: 'Minimum Items', valueType: 'number', description: 'Minimum selections', placeholder: '1' },
  { rule: 'max', label: 'Maximum Items', valueType: 'number', description: 'Maximum selections', placeholder: '5' },
 ],
  date: [
    { rule: 'required', label: 'Required', valueType: 'none', description: 'Date is required' },
    { rule: 'date', label: 'Valid Date', valueType: 'none', description: 'Must be a valid date' },
    { rule: 'after_or_equal', label: 'After or Equal', valueType: 'string', description: 'Date must be after or equal to', placeholder: '2024-01-01' },
    { rule: 'before_or_equal', label: 'Before or Equal', valueType: 'string', description: 'Date must be before or equal to', placeholder: '2024-12-31' },
  ],
  password: [
    { rule: 'required', label: 'Required', valueType: 'none', description: 'Password is required' },
    { rule: 'min', label: 'Minimum Length', valueType: 'number', description: 'Minimum password length', placeholder: '8' },
    { rule: 'regex', label: 'Pattern (Regex)', valueType: 'string', description: 'Password strength regex' },
  ],
  url: [
    { rule: 'required', label: 'Required', valueType: 'none', description: 'URL is required' },
    { rule: 'url', label: 'Valid URL', valueType: 'none', description: 'Must be a valid URL' },
  ],
};

const COMMON_RULES = [
  { rule: 'required', label: 'Required', valueType: 'none' as const, description: 'Field is required' },
  { rule: 'custom', label: 'Custom Rule', valueType: 'string' as const, description: 'Add any custom rule' },
];

export function ValidationRulesInput({
  value = {},
  onChange,
  disabled = false,
  error,
  inputType = 'text',
}: any) {
  const { t } = useTranslations();
  const [newRule, setNewRule] = useState('');
  const [newValue, setNewValue] = useState('');
  const [newMessage, setNewMessage] = useState('');


  const normalizeRulesForLaravel = (rules: Record<string, any>) => {
                                      const normalized: Record<string, any> = {};

                                      Object.entries(rules).forEach(([rule, config]) => {
                                        const laravelRule = LARAVEL_RULE_MAP[rule] || rule;

                                        if (config?.value !== undefined) {
                                          normalized[laravelRule] = config.value;
                                        } else {
                                          normalized[laravelRule] = true;
                                        }
                                      });

                                      return normalized;
                                    };


  const availableRules = useMemo(() => {
    const typeRules = RULES_BY_INPUT_TYPE[inputType] || [];
    return [...typeRules, ...COMMON_RULES.filter(
      (cr) => !typeRules.some((tr) => tr.rule === cr.rule)
    )];
  }, [inputType]);

  const getRuleConfig = (rule: string) => {
    return availableRules.find((r) => r.rule === rule);
  };

  const addRule = () => {
    if (!newRule.trim()) return;

    const config = getRuleConfig(newRule);
    if (!config) return;

    const ruleValue: any = {
      message: newMessage.trim() || `${newRule} validation failed`,
    };

    if (config.valueType !== 'none' && newValue.trim()) {
      if (config.valueType === 'number') {
        ruleValue.value = Number(newValue);
      } else {
        ruleValue.value = newValue.trim();
      }
    }

    const updated = {
      ...value,
      [newRule]: ruleValue,
    };

    onChange((updated));
    setNewRule('');
    setNewValue('');
    setNewMessage('');
  };

  const removeRule = (rule: string) => {
    const updated = { ...value };
    delete updated[rule];
    onChange((updated));
  };

  const updateRuleMessage = (rule: string, message: string) => {
    const updated = {
      ...value,
      [rule]: {
        ...value![rule],
        message: message.trim(),
      },
    };
    onChange((updated));
  };

  const addedRules = Object.keys(value || {});
  const newRuleConfig = getRuleConfig(newRule);

  return (
    <div className="space-y-4">
      {/* Info Alert */}
      <div className="p-3 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg flex gap-2">
        <AlertCircle className="w-4 h-4 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5" />
        <div className="text-sm text-blue-900 dark:text-blue-200">
          <span className="font-semibold">{t('Input Type')}:</span> {inputType}
          <br />
          <span className="text-xs">{t('Showing rules relevant to this input type')}</span>
        </div>
      </div>

      {/* Input Section */}
      <div className="space-y-3 p-4 border rounded-lg bg-gray-50/50 dark:bg-gray-900/30">
        <div className="space-y-2">
          <label className="text-xs font-medium text-gray-600 dark:text-gray-400">
            {t('Rule')}
          </label>
          <Select value={newRule} onValueChange={setNewRule} disabled={disabled}>
            <SelectTrigger className="text-sm">
              <SelectValue placeholder={t('Select a validation rule')} />
            </SelectTrigger>
            <SelectContent>
              {availableRules.map((rule) => (
                <SelectItem
                  key={rule.rule}
                  value={rule.rule}
                  disabled={addedRules.includes(rule.rule)}
                >
                  {rule.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {newRuleConfig?.description && (
            <p className="text-xs text-gray-500 dark:text-gray-400">
              {newRuleConfig.description}
            </p>
          )}
        </div>

        {newRuleConfig && newRuleConfig.valueType !== 'none' && (
          <div>
            <label className="text-xs font-medium text-gray-600 dark:text-gray-400 mb-1 block">
              {t('Value')}
            </label>
            <Input
              placeholder={('Enter value')}
              value={newValue}
              onChange={(e) => setNewValue(e.target.value)}
              disabled={disabled}
              className="text-sm"
              type={newRuleConfig.valueType === 'number' ? 'number' : 'text'}
            />
          </div>
        )}

        <div>
          <label className="text-xs font-medium text-gray-600 dark:text-gray-400 mb-1 block">
            {t('Error Message')} {t('(optional)')}
          </label>
          <Input
            placeholder={t('Custom error message')}
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            disabled={disabled}
            className="text-sm"
          />
        </div>

        <Button
          type="button"
          onClick={addRule}
          disabled={disabled || !newRule}
          size="sm"
          className="w-full"
        >
          <Plus className="w-4 h-4 mr-2" />
          {t('Add Rule')}
        </Button>
      </div>

      {/* Error Message */}
      {error && (
        <p className="text-sm font-medium text-destructive">{error}</p>
      )}

      {/* Display Rules */}
      {addedRules.length > 0 ? (
        <div className="space-y-2">
          <div className="text-xs font-medium text-gray-600 dark:text-gray-400">
            {t('Added Rules')} ({addedRules.length})
          </div>
          <div className="space-y-2 max-h-96 overflow-y-auto">
            {addedRules.map((rule) => {
              const ruleConfig = getRuleConfig(rule);
              const ruleData = value![rule];
              return (
                <div
                  key={rule}
                  className="p-3 border rounded-lg bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 transition-all"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1 space-y-2">
                      <div className="flex items-center gap-2">
                        <Badge variant="secondary" className="text-xs">
                          {ruleConfig?.label || rule}
                        </Badge>
                        {ruleData.value !== undefined && (
                          <code className="text-xs bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded text-gray-700 dark:text-gray-300">
                            {String(ruleData.value)}
                          </code>
                        )}
                      </div>

                      {ruleData.message && (
                        <div className="text-sm text-gray-700 dark:text-gray-300">
                          <span className="text-xs font-medium text-gray-500 dark:text-gray-400">
                            {t('Message')}:
                          </span>{' '}
                          {ruleData.message}
                        </div>
                      )}

                      <Input
                        placeholder={t('Update error message')}
                        defaultValue={ruleData.message || ''}
                        onBlur={(e) =>
                          updateRuleMessage(rule, e.target.value)
                        }
                        disabled={disabled}
                        className="text-sm"
                      />
                    </div>

                    <button
                      type="button"
                      onClick={() => removeRule(rule)}
                      disabled={disabled}
                      className="p-2 hover:bg-red-100 dark:hover:bg-red-900/30 rounded transition-colors text-red-600 dark:text-red-400 flex-shrink-0"
                      title={t('Delete')}
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      ) : (
        <div className="p-4 text-center text-sm text-gray-500 dark:text-gray-400 border border-dashed rounded-lg">
          {t('No validation rules added. Add rules above to validate user input.')}
        </div>
      )}

      {/* JSON Preview */}
      {addedRules.length > 0 && (
        <div className="p-3 bg-gray-100 dark:bg-gray-800 rounded border border-gray-200 dark:border-gray-700">
          <div className="text-xs font-semibold text-gray-600 dark:text-gray-400 mb-2">
            {t('JSON Preview')}
          </div>
          <code className="text-xs text-gray-700 dark:text-gray-300 break-words block overflow-auto max-h-40">
            {JSON.stringify(value, null, 2)}
          </code>
        </div>
      )}
    </div>
  );
}

export default ValidationRulesInput;