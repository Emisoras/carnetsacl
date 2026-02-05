
import React from 'react';
import { AffiliateData } from './types';

export const COLORS = {
  wine: '#6B0D0D',
  wineDark: '#3A0404',
  textDark: '#1A1A1A',
  textLight: '#4B5563',
  labelBlue: '#2563EB',
};

export const ACLLogo: React.FC<{ className?: string; color?: string }> = ({ className = "h-16", color = "white" }) => (
  <svg viewBox="0 0 200 130" className={className} fill={color} xmlns="http://www.w3.org/2000/svg">
    <g transform="translate(40, 10)">
      <rect x="10" y="5" width="20" height="55" rx="10" opacity="0.6" />
      <rect x="45" y="0" width="30" height="75" rx="15" />
      <rect x="90" y="5" width="20" height="55" rx="10" opacity="0.6" />
      
      <circle cx="60" cy="45" r="32" fill={color} stroke={color === 'white' ? '#6B0D0D' : 'white'} strokeWidth="2" />
      <text x="60" y="53" textAnchor="middle" fill={color === 'white' ? '#6B0D0D' : 'white'} fontSize="26" fontWeight="900" fontFamily="Montserrat">ACL</text>
    </g>
    <text x="100" y="110" textAnchor="middle" fill={color} fontSize="9" fontWeight="800" letterSpacing="0.5" fontFamily="Montserrat">
      ASOCIACIÓN COLOMBIANA DE
    </text>
    <text x="100" y="122" textAnchor="middle" fill={color} fontSize="9" fontWeight="800" letterSpacing="0.5" fontFamily="Montserrat">
      LOCUTORES Y COMUNICADORES
    </text>
  </svg>
);

export const DEFAULT_DATA: AffiliateData = {
  firstName: "NOMBRE DEL",
  lastName: "AFILIADO AQUÍ",
  documentNumber: "00.000.000",
  affiliateNumber: "0000",
  photoUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=400&h=400&auto=format&fit=crop",
  photoScale: 1.1,
  photoX: 0,
  photoY: 0,
  logoUrl: null,
  logoScale: 1.16,
  watermarkUrl: null,
  watermarkRotation: 12,
  watermarkOpacity: 0.12,
  validUntil: "31/12/2027",
  presidentSignatureUrl: "https://upload.wikimedia.org/wikipedia/commons/f/f8/Signature_of_John_Hancock.svg",
  presidentName: "HUMBERTO RODRÍGUEZ CALDERÓN",
  // Visibilidad de datos en frente
  showDocumentNumber: true,
  // Bloqueos
  lockLogo: false,
  lockWatermark: false,
  lockWatermarkOpacity: false,
  lockPhoto: false,
  lockSignature: false,
  backAccreditationText: "ESTE CARNET ES PERSONAL E INTRANSFERIBLE Y ACREDITA AL PORTADOR COMO MIEMBRO ACTIVO DE LA ASOCIACIÓN COLOMBIANA DE LOCUTORES Y COMUNICADORES (ACL).",
  backSupportText: "La ACL respalda el ejercicio profesional de la locución en Colombia. Se solicita a las autoridades brindar la colaboración necesaria al portador, integrante identificado de nuestra Asociación.",
  backContactPhone: "(+57) 322 400 51 96"
};
