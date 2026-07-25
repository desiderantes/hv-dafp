export type DocumentType = 'CC' | 'CE' | 'PAS' | '';
export type Gender = 'F' | 'M' | '';
export type Nationality = 'COL' | 'EXTRANJERO' | '';
export type MilitaryBookClass = '1' | '2' | '';
export type AcademicDegreeType = 'TC' | 'TL' | 'TE' | 'UN' | 'ES' | 'MG' | 'DOC' | '';
export type LanguageLevel = 'R' | 'B' | 'MB' | '';
export type CompanyType = 'PUBLICA' | 'PRIVADA' | 'INDEPENDIENTE' | '';
export type DisqualificationOption = 'SI' | 'NO' | '';

export interface SimpleDate {
  day: string;
  month: string;
  year: string;
}

export interface MilitaryServiceData {
  bookClass: MilitaryBookClass;
  number: string;
  militaryDistrict: string;
}

export interface BirthData {
  birthDay: string;
  birthMonth: string;
  birthYear: string;
  country: string;
  state: string;
  city: string;
}

export interface AddressData {
  address: string;
  country: string;
  state: string;
  city: string;
  phone: string;
  email: string;
}

export interface PersonalData {
  firstLastName: string;
  secondLastName: string;
  firstNames: string;
  documentType: DocumentType;
  documentNumber: string;
  gender: Gender;
  nationality: Nationality;
  nationalityCountry: string;
  militaryService: MilitaryServiceData;
  birthData: BirthData;
  contactAddress: AddressData;
}

export interface BasicEducation {
  lastGrade: number | null; // 1..11
  titleObtained: string;
  graduationMonth: string;
  graduationYear: string;
}

export interface HigherEducationItem {
  id: string;
  degreeType: AcademicDegreeType;
  approvedSemesters: string;
  isGraduated: 'SI' | 'NO' | '';
  studyName: string;
  endMonth: string;
  endYear: string;
  professionalCardNumber: string;
}

export interface LanguageItem {
  id: string;
  language: string;
  speaks: LanguageLevel;
  reads: LanguageLevel;
  writes: LanguageLevel;
}

export interface EducationData {
  basic: BasicEducation;
  higher: HigherEducationItem[];
  languages: LanguageItem[];
}

export interface WorkExperienceItem {
  id: string;
  isCurrent: boolean;
  companyName: string;
  companyType: CompanyType;
  country: string;
  state: string;
  city: string;
  companyEmail: string;
  phoneNumbers: string;
  startDate: SimpleDate;
  endDate: SimpleDate;
  jobTitle: string;
  department: string;
  address: string;
}

export interface ExperienceTimeItem {
  years: number;
  months: number;
}

export interface TotalExperienceTime {
  publicSector: ExperienceTimeItem;
  privateSector: ExperienceTimeItem;
  independent: ExperienceTimeItem;
  manualOverride: boolean;
}

export interface SignatureData {
  disqualification: DisqualificationOption;
  dateAndCity: string;
  signatureType: 'DRAW' | 'IMAGE' | 'TEXT';
  signatureData: string;
}

export interface HrObservationsData {
  observations: string;
  dateAndCity: string;
  hrHeadNameAndSignature: string;
}

export interface ResumeData {
  receivingEntity: string;
  personalData: PersonalData;
  educationData: EducationData;
  workExperience: WorkExperienceItem[];
  totalExperience: TotalExperienceTime;
  signature: SignatureData;
  hrObservations: HrObservationsData;
}
