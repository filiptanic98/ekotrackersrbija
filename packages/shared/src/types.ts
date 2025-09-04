export enum DumpStatus {
  ACTIVE = 'ACTIVE',
  IN_PROGRESS = 'IN_PROGRESS',
  REMOVAL_PENDING_CONFIRMATION = 'REMOVAL_PENDING_CONFIRMATION',
  REMOVED = 'REMOVED'
}

export enum EnvironmentType {
  RIVER = 'RIVER',
  PARK = 'PARK', 
  RESIDENTIAL = 'RESIDENTIAL',
  INDUSTRIAL = 'INDUSTRIAL',
  OTHER = 'OTHER'
}

export interface DumpDTO {
  id: string;
  description: string;
  latitude: number;
  longitude: number;
  urgency: number; // 1-5
  appearance: number; // 1-5
  environmentType: EnvironmentType;
  weight: number;
  status: DumpStatus;
  reportsCount: number;
  municipalityId: string;
  municipality?: MunicipalityDTO;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateDumpInput {
  description: string;
  latitude: number;
  longitude: number;
  urgency: number; // 1-5
  appearance: number; // 1-5
  environmentType: EnvironmentType;
}

export interface MunicipalityDTO {
  id: string;
  name: string;
  email: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateMunicipalityInput {
  name: string;
  email: string;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
}

export interface AggregationResult {
  aggregatedInto: string;
  reportsCount: number;
}