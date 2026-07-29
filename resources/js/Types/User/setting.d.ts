export type AdditionalInfoItem = {
  label: string;
  value: string;
  [key: string]: any; 
};

export type HealthCheckItem = {
  name: string;
  status: boolean;
 [key: string]: any; 
};

export type SystemInfo = {
  environment?: string;
  debug_mode?: boolean;
  timezone?: string;

  php_version?: string;
  laravel_version?: string;
  server_software?: string;
  database_version?: string;

  memory_limit?: string;
  max_execution_time?: string | number;
  upload_max_filesize?: string;
  cache_driver?: string;
  session_driver?: string;

  additional_info?: AdditionalInfoItem[];
  health_checks?: HealthCheckItem[];
  [key: string]: any; 
};

export type SystemOverviewProps = {
  // Explicit `| undefined` because the project sets
  // `exactOptionalPropertyTypes`, under which `?:` alone does not permit an
  // explicitly-passed `undefined`.
  systemInfo?: SystemInfo | undefined;
};


export interface SyatemInfoPageProps {
  title: string;
  modelProperty?: ModelProperty; 
  systemInfo?: SystemInfo;
}


export interface CachePageProps {
  title: string;
  modelProperty?: ModelProperty; 
  cacheInfo?: any;
}

export interface AutomationPageProps {
  title: string;
  modelProperty?: ModelProperty; 
  automationData?: any;
}


export interface BackupPageProps {
  title: string;
  modelProperty?: ModelProperty; 
  backups?: any;
  storageInfo?: any;

}



export interface CacheStatistic {
  label: string;
  value: string | number;
}

export interface CacheStore {
  name: string;
  status: string;
  driver: string;
  size: number;
  keys?: number;
}

export interface CacheInfo {
  driver?: string;
  status?: string;
  total_size?: number;
  hit_rate?: number;
  default_ttl?: number;
  prefix?: string;
  serializer?: string;
  statistics?: CacheStatistic[];
  stores?: CacheStore[];
}

export interface CacheOverviewProps {
  cacheInfo?: CacheInfo;
  routePrefix?:string
}


type AutomationStatusType = 'active' | 'running' | 'failed' | 'pending' | 'success';

export interface AutomationCommand {
  id: number | string;
  name: string;
  description?: string;
  command: string;
  schedule?: string;
  status: AutomationStatusType | string;
  last_run?: string;
  next_run?: string;
  duration?: number;
  [key: string]: any; 

}

export interface AutomationHistory {
  command: string;
  status: StatusType | string;
  timestamp: string;
  duration?: number;
  [key: string]: any; 

}

export interface AutomationData {
  cron_status?: string;
  active_jobs?: number;
  last_run?: string;
  success_rate?: number;
  cron_command?: string;
  commands?: AutomationCommand[];
  history?: AutomationHistory[];
  [key: string]: any; 

}

export interface AutomationOverviewProps {
  automationData?: AutomationData;
  [key: string]: any; 
}


export interface Language {
  id: number;
  name: string;
  code: string;
  [key: string]: any;
}

export interface PaginatedLanguages {
  data: Language[];
}


export interface LanguageProps {
  title: string;
  data: any;
  modelProperty: any,
  [key: string]: any;
}

 
export interface TranslationProps {
  title: string;
  language: any;
  translations: any;
  modelProperty: any;
  [key: string]: any;
}


export type MailConfigurationProps = {
  title: string
  modelProperty?: any
  mailConfiguration?: any
}
