import { useCallback, useEffect, useRef, useState } from 'react';
import { FunctionsHttpError } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { createMeasurementConfig, validateMeasurementConfig, type MeasurementConfig } from '@/services/measurementConfig';

// Loads and saves the company's shared measurement configuration in Neon through the
// authenticated edge function; falls back to the built-in defaults when none is saved yet.
export function useMeasurementSettings() {
  const [config, setConfig] = useState<MeasurementConfig>(createMeasurementConfig);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const loaded = useRef(false);

  useEffect(() => {
    if (loaded.current) return;
    loaded.current = true;
    (async () => {
      try {
        const { data, error: invokeError } = await supabase.functions.invoke('neon-measurement-settings', { method: 'GET' });
        if (invokeError) {
          const details = invokeError instanceof FunctionsHttpError ? await invokeError.context.text() : invokeError.message;
          throw new Error(details);
        }
        if (data?.config) {
          const remote = data.config as MeasurementConfig;
          validateMeasurementConfig(remote);
          setConfig(remote);
        }
      } catch (err) {
        console.error('measurement settings load failed:', err);
        setError('Não foi possível carregar a configuração salva; usando os valores padrão.');
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const save = useCallback(async (value: MeasurementConfig): Promise<boolean> => {
    setSaving(true);
    setError('');
    try {
      validateMeasurementConfig(value);
      const { error: invokeError } = await supabase.functions.invoke('neon-measurement-settings', {
        method: 'PUT',
        body: { config: value },
      });
      if (invokeError) {
        const details = invokeError instanceof FunctionsHttpError ? await invokeError.context.text() : invokeError.message;
        throw new Error(details);
      }
      return true;
    } catch (err) {
      console.error('measurement settings save failed:', err);
      setError(err instanceof Error ? err.message : 'Não foi possível salvar a configuração.');
      return false;
    } finally {
      setSaving(false);
    }
  }, []);

  return { config, setConfig, loading, saving, error, save };
}
