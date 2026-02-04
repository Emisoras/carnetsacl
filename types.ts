
export interface AffiliateData {
  firstName: string;
  lastName: string;
  documentNumber: string;
  affiliateNumber: string;
  photoUrl: string;
  photoScale: number;
  photoX: number;
  photoY: number;
  logoUrl: string | null;
  logoScale: number;
  watermarkUrl: string | null;
  watermarkRotation: number;
  watermarkOpacity: number;
  validUntil: string;
  presidentSignatureUrl: string;
  presidentName: string;
  // Bloqueos independientes
  lockLogo: boolean;
  lockWatermark: boolean;
  lockWatermarkOpacity: boolean;
  lockPhoto: boolean;
  lockSignature: boolean;
  // Textos editables del reverso
  backAccreditationText: string;
  backSupportText: string;
  backContactPhone: string;
}

export enum CardSide {
  FRONT = 'FRONT',
  BACK = 'BACK'
}
