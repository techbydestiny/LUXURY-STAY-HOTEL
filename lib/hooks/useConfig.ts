// lib/hooks/useConfig.ts
import { useEffect, useState } from 'react';
import { HotelConfig } from '@/types';
import { mockConfig } from '@/lib/mock/data';

export const useConfig = () => {
  const [config, setConfig] = useState<HotelConfig | null>(mockConfig); // Start with mockConfig immediately
  const [loading, setLoading] = useState(false); // Start with false since we have mock data
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Apply CSS custom properties immediately
    if (typeof document !== 'undefined' && mockConfig) {
      document.documentElement.style.setProperty('--primary-color', mockConfig.primary_color);
      document.documentElement.style.setProperty('--secondary-color', mockConfig.secondary_color);
      document.documentElement.style.setProperty('--accent-color', mockConfig.accent_color);
    }

    // Optionally fetch from API later
    const fetchConfig = async () => {
      try {
        // Uncomment this when you have real API
        // const response = await configApi.getPublicConfig();
        // setConfig(response);
      } catch (err) {
        console.error('Failed to fetch config from API, using mock data', err);
      }
    };

    // fetchConfig(); // Uncomment when API is ready
  }, []);

  return { config, loading, error };
};