// Represents the structure of an Inertia page returned from Laravel
export interface InertiaPage<Props = any> {
  component: string;        // The React component name
  props: Props;             // Props passed to the component
  url: string;              // Current URL
  version?: string;         // Asset version for cache busting
  errors?: Record<string, string>; // Validation errors
  remembered?: Record<string, any>; // Inertia remember feature
}
