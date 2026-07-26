import React, { useState } from 'react';
import { ResumeData, HigherEducationItem, LanguageItem, WorkExperienceItem, AcademicDegreeType } from '../../types/cv';
import { Plus, Trash2, ArrowUp, ArrowDown, PenTool, Type, Image as ImageIcon, RotateCcw, Check } from 'lucide-react';
import { SegmentedInput } from '../common/SegmentedInput';

interface Props {
  data: ResumeData;
  onChange: (newData: ResumeData) => void;
}

export const DocumentView: React.FC<Props> = ({ data, onChange }) => {
  const { receivingEntity, personalData, educationData, workExperience, totalExperience, signature, hrObservations } = data;

  const [showSignatureModal, setShowSignatureModal] = useState(false);
  const [signatureCanvasRef, setSignatureCanvasRef] = useState<HTMLCanvasElement | null>(null);
  const [isDrawing, setIsDrawing] = useState(false);

  // Helper updater
  const updateData = (updater: (prev: ResumeData) => ResumeData) => {
    onChange(updater(data));
  };

  // 1. Personal Data Updaters
  const updatePersonal = (field: string, value: any) => {
    updateData((prev) => ({
      ...prev,
      personalData: { ...prev.personalData, [field]: value },
    }));
  };

  const updateNestedPersonal = (parent: 'militaryService' | 'birthData' | 'contactAddress', field: string, value: any) => {
    updateData((prev) => ({
      ...prev,
      personalData: {
        ...prev.personalData,
        [parent]: { ...prev.personalData[parent], [field]: value },
      },
    }));
  };

  // 2. Education Data Updaters
  const updateBasicEducation = (field: string, value: any) => {
    updateData((prev) => ({
      ...prev,
      educationData: {
        ...prev.educationData,
        basic: { ...prev.educationData.basic, [field]: value },
      },
    }));
  };

  const updateHigherItem = (index: number, field: keyof HigherEducationItem, value: any) => {
    const updated = [...educationData.higher];
    updated[index] = { ...updated[index], [field]: value };
    updateData((prev) => ({
      ...prev,
      educationData: { ...prev.educationData, higher: updated },
    }));
  };

  const addHigherItem = () => {
    const newItem: HigherEducationItem = {
      id: Date.now().toString(),
      degreeType: 'UN',
      approvedSemesters: '',
      isGraduated: 'SI',
      studyName: '',
      endMonth: '',
      endYear: '',
      professionalCardNumber: '',
    };
    updateData((prev) => ({
      ...prev,
      educationData: { ...prev.educationData, higher: [...prev.educationData.higher, newItem] },
    }));
  };

  const removeHigherItem = (index: number) => {
    const updated = educationData.higher.filter((_, i) => i !== index);
    updateData((prev) => ({
      ...prev,
      educationData: { ...prev.educationData, higher: updated },
    }));
  };

  const updateLanguageItem = (index: number, field: keyof LanguageItem, value: any) => {
    const updated = [...educationData.languages];
    updated[index] = { ...updated[index], [field]: value };
    updateData((prev) => ({
      ...prev,
      educationData: { ...prev.educationData, languages: updated },
    }));
  };

  const addLanguageItem = () => {
    const newItem: LanguageItem = {
      id: Date.now().toString(),
      language: '',
      speaks: 'B',
      reads: 'B',
      writes: 'B',
    };
    updateData((prev) => ({
      ...prev,
      educationData: { ...prev.educationData, languages: [...prev.educationData.languages, newItem] },
    }));
  };

  const removeLanguageItem = (index: number) => {
    const updated = educationData.languages.filter((_, i) => i !== index);
    updateData((prev) => ({
      ...prev,
      educationData: { ...prev.educationData, languages: updated },
    }));
  };

  // 3. Work Experience Updaters
  const updateExperienceItem = (index: number, field: keyof WorkExperienceItem, value: any) => {
    const updated = [...workExperience];
    updated[index] = { ...updated[index], [field]: value };
    updateData((prev) => ({ ...prev, workExperience: updated }));
  };

  const updateExperienceDate = (index: number, fechaType: 'startDate' | 'endDate', field: 'day' | 'month' | 'year', val: string) => {
    const updated = [...workExperience];
    updated[index] = {
      ...updated[index],
      [fechaType]: { ...updated[index][fechaType], [field]: val },
    };
    updateData((prev) => ({ ...prev, workExperience: updated }));
  };

  const addExperiencePage = () => {
    const newItems: WorkExperienceItem[] = Array.from({ length: 4 }).map((_, idx) => ({
      id: (Date.now() + idx).toString(),
      isCurrent: false,
      companyName: '',
      companyType: '',
      country: '',
      state: '',
      city: '',
      companyEmail: '',
      phoneNumbers: '',
      startDate: { day: '', month: '', year: '' },
      endDate: { day: '', month: '', year: '' },
      jobTitle: '',
      department: '',
      address: '',
    }));
    updateData((prev) => ({ ...prev, workExperience: [...prev.workExperience, ...newItems] }));
  };

  const handleCompanyNameChange = (globalIndex: number, val: string) => {
    const upperName = val.toUpperCase();
    const updated = [...workExperience];

    if (!updated[globalIndex]) {
      updated[globalIndex] = {
        id: Date.now().toString(),
        isCurrent: globalIndex === 0,
        companyName: upperName,
        companyType: '',
        country: upperName.trim() !== '' ? 'COLOMBIA' : '',
        state: '',
        city: '',
        companyEmail: '',
        phoneNumbers: '',
        startDate: { day: '', month: '', year: '' },
        endDate: { day: '', month: '', year: '' },
        jobTitle: '',
        department: '',
        address: '',
      };
    } else {
      const current = updated[globalIndex];
      const newCountry = (!current.country && upperName.trim() !== '') ? 'COLOMBIA' : current.country;
      updated[globalIndex] = {
        ...current,
        companyName: upperName,
        country: newCountry,
      };
    }

    updateData((prev) => ({ ...prev, workExperience: updated }));
  };

  const removeExperiencePage = (pageIndex: number) => {
    if (pageIndex === 0) return;
    const startIndex = pageIndex * 4;
    const updated = workExperience.filter((_, i) => i < startIndex || i >= startIndex + 4);
    updateData((prev) => ({ ...prev, workExperience: updated }));
  };

  const moveExperienceUp = (index: number) => {
    if (index === 0) return;
    const updated = [...workExperience];
    const temp = updated[index - 1];
    updated[index - 1] = updated[index];
    updated[index] = temp;
    const reindexed = updated.map((item, idx) => ({
      ...item,
      isCurrent: idx === 0,
    }));
    updateData((prev) => ({ ...prev, workExperience: reindexed }));
  };

  const moveExperienceDown = (index: number) => {
    if (index === workExperience.length - 1) return;
    const updated = [...workExperience];
    const temp = updated[index + 1];
    updated[index + 1] = updated[index];
    updated[index] = temp;
    const reindexed = updated.map((item, idx) => ({
      ...item,
      isCurrent: idx === 0,
    }));
    updateData((prev) => ({ ...prev, workExperience: reindexed }));
  };

  // 4. Total Experience Updaters
  const updateExperienceTimeItem = (key: 'publicSector' | 'privateSector' | 'independent', field: 'years' | 'months', val: number) => {
    updateData((prev) => ({
      ...prev,
      totalExperience: {
        ...prev.totalExperience,
        manualOverride: true,
        [key]: { ...prev.totalExperience[key], [field]: isNaN(val) ? 0 : val },
      },
    }));
  };

  // Calculate totals
  const totalYears = totalExperience.publicSector.years + totalExperience.privateSector.years + totalExperience.independent.years;
  const totalMonthsRaw = totalExperience.publicSector.months + totalExperience.privateSector.months + totalExperience.independent.months;
  const totalYearsCalculated = totalYears + Math.floor(totalMonthsRaw / 12);
  const totalMonthsCalculated = totalMonthsRaw % 12;

  // Experience Page Chunking: Minimum 1 page (4 slots)
  const expChunkSize = 4;
  const expPages: typeof workExperience[] = [];
  const minPageCount = Math.max(1, Math.ceil(workExperience.length / expChunkSize));
  for (let p = 0; p < minPageCount; p++) {
    expPages.push(workExperience.slice(p * expChunkSize, (p + 1) * expChunkSize));
  }

  // Signature canvas handlers
  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    setIsDrawing(true);
    if (!signatureCanvasRef) return;
    const ctx = signatureCanvasRef.getContext('2d');
    if (!ctx) return;
    const rect = signatureCanvasRef.getBoundingClientRect();
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;
    ctx.beginPath();
    ctx.moveTo(clientX - rect.left, clientY - rect.top);
  };

  const draw = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    if (!isDrawing || !signatureCanvasRef) return;
    const ctx = signatureCanvasRef.getContext('2d');
    if (!ctx) return;
    const rect = signatureCanvasRef.getBoundingClientRect();
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;
    ctx.lineWidth = 2.5;
    ctx.lineCap = 'round';
    ctx.strokeStyle = '#0b192c';
    ctx.lineTo(clientX - rect.left, clientY - rect.top);
    ctx.stroke();
  };

  const stopDrawing = () => {
    if (!isDrawing) return;
    setIsDrawing(false);
    if (signatureCanvasRef) {
      const dataUrl = signatureCanvasRef.toDataURL('image/png');
      updateData((prev) => ({ ...prev, signature: { ...prev.signature, signatureData: dataUrl } }));
    }
  };

  return (
    <div className="doc-container">
      {/* ==================== PAGE 1 ==================== */}
      <div className="cv-page">
        {/* Header Box */}
        <div className="doc-header-border-box">
          <div className="doc-header-left">
            <img src={`${import.meta.env.BASE_URL}Logo_Gobierno_de_Colombia.svg`} alt="Gobierno de Colombia" className="doc-header-logo" />
            <div style={{ fontSize: '6.5pt', fontWeight: 'bold', lineHeight: '1.1', textAlign: 'center', marginTop: '2px' }}>
              Libertad y Orden
            </div>
          </div>

          <div className="doc-header-titles">
            <h1>FORMATO ÚNICO</h1>
            <h2>HOJA DE VIDA</h2>
            <p>Persona Natural</p>
            <div className="doc-header-subtitle">(Leyes 190 de 1995, 489 y 443 de 1998)</div>
          </div>

          <div className="doc-header-entidad">
            <div className="doc-label" style={{ textAlign: 'center', marginBottom: '2px' }}>ENTIDAD RECEPTORA</div>
            <div className="doc-header-entidad-box">
              <textarea
                className="live-doc-textarea"
                style={{ fontSize: '7pt', fontWeight: 'bold', textTransform: 'uppercase', height: '24px', resize: 'none', lineHeight: '1.1', padding: 0, background: '#ffffff' }}
                value={receivingEntity}
                onChange={(e) => updateData((prev) => ({ ...prev, receivingEntity: e.target.value.toUpperCase() }))}
              />
            </div>
          </div>
        </div>

        {/* Section 1: DATOS PERSONALES */}
        <div className="doc-section-badge">
          <div className="doc-section-num">1</div>
          <div className="doc-section-dash"></div>
          <div className="doc-section-title">DATOS PERSONALES</div>
        </div>

        <div className="doc-section-box">
          {/* Row 1: APELLIDOS Y NOMBRES (28% / 28% / 44%) */}
          <table className="doc-table" style={{ margin: 0, border: 'none', borderBottom: '1px solid #000' }}>
            <tbody>
              <tr>
                <td style={{ width: '28%' }}>
                  <span className="doc-label">PRIMER APELLIDO</span>
                  <input
                    type="text"
                    className="live-doc-input"
                    value={personalData.firstLastName}
                    onChange={(e) => updatePersonal('firstLastName', e.target.value.toUpperCase())}
                  />
                </td>
                <td style={{ width: '28%' }}>
                  <span className="doc-label">SEGUNDO APELLIDO ( O DE CASADA )</span>
                  <input
                    type="text"
                    className="live-doc-input"
                    value={personalData.secondLastName}
                    onChange={(e) => updatePersonal('secondLastName', e.target.value.toUpperCase())}
                  />
                </td>
                <td style={{ width: '44%' }}>
                  <span className="doc-label">NOMBRES</span>
                  <input
                    type="text"
                    className="live-doc-input"
                    value={personalData.firstNames}
                    onChange={(e) => updatePersonal('firstNames', e.target.value.toUpperCase())}
                  />
                </td>
              </tr>
            </tbody>
          </table>

          {/* Row 2: DOCUMENTO, SEXO, NACIONALIDAD (46% / 9.5% / 44.5%) */}
          <table className="doc-table" style={{ margin: 0, border: 'none', borderBottom: '1px solid #000' }}>
            <tbody>
              <tr>
                <td style={{ width: '46%' }}>
                  <span className="doc-label">DOCUMENTO DE IDENTIFICACIÓN</span>
                  <div style={{ marginTop: '3px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <span>
                      <span className="doc-radio" onClick={() => updatePersonal('documentType', 'CC')}>
                        C.C <span className={`doc-circle ${personalData.documentType === 'CC' ? 'checked' : ''}`}></span>
                      </span>
                      <span className="doc-radio" onClick={() => updatePersonal('documentType', 'CE')}>
                        C.E <span className={`doc-circle ${personalData.documentType === 'CE' ? 'checked' : ''}`}></span>
                      </span>
                      <span className="doc-radio" onClick={() => updatePersonal('documentType', 'PAS')}>
                        PAS <span className={`doc-circle ${personalData.documentType === 'PAS' ? 'checked' : ''}`}></span>
                      </span>
                    </span>
                    <span style={{ fontSize: '8pt', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '3px' }}>
                      No.
                      <input
                        type="text"
                        className="live-doc-input live-doc-underline"
                        style={{ width: '105px' }}
                        value={personalData.documentNumber}
                        onChange={(e) => updatePersonal('documentNumber', e.target.value)}
                      />
                    </span>
                  </div>
                </td>

                <td style={{ width: '9.5%' }}>
                  <span className="doc-label">SEXO</span>
                  <div style={{ marginTop: '3px', display: 'flex', justifyContent: 'center', gap: '6px' }}>
                    <span className="doc-radio" style={{ marginRight: 0 }} onClick={() => updatePersonal('gender', 'F')}>
                      F <span className={`doc-circle ${personalData.gender === 'F' ? 'checked' : ''}`}></span>
                    </span>
                    <span className="doc-radio" style={{ marginRight: 0 }} onClick={() => updatePersonal('gender', 'M')}>
                      M <span className={`doc-circle ${personalData.gender === 'M' ? 'checked' : ''}`}></span>
                    </span>
                  </div>
                </td>

                <td style={{ width: '44.5%' }}>
                  <span className="doc-label">NACIONALIDAD</span>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '3px' }}>
                    <span>
                      <span className="doc-radio" onClick={() => { updatePersonal('nationality', 'COL'); updatePersonal('nationalityCountry', 'COLOMBIA'); }}>
                        COL. <span className={`doc-circle ${personalData.nationality === 'COL' ? 'checked' : ''}`}></span>
                      </span>
                      <span className="doc-radio" onClick={() => updatePersonal('nationality', 'EXTRANJERO')}>
                        EXTRANJERO <span className={`doc-circle ${personalData.nationality === 'EXTRANJERO' ? 'checked' : ''}`}></span>
                      </span>
                    </span>
                    <span style={{ fontSize: '7.5pt', display: 'flex', alignItems: 'center', gap: '4px', flex: 1, marginLeft: '8px' }}>
                      <span className="doc-label" style={{ display: 'inline', marginBottom: 0 }}>PAÍS</span>
                      <input
                        type="text"
                        className="live-doc-input live-doc-underline"
                        style={{ flex: 1 }}
                        value={personalData.nationalityCountry}
                        onChange={(e) => updatePersonal('nationalityCountry', e.target.value.toUpperCase())}
                      />
                    </span>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>

          {/* Row 3: LIBRETA MILITAR (100%) */}
          <table className="doc-table" style={{ margin: 0, border: 'none', borderBottom: '1px solid #000' }}>
            <tbody>
              <tr>
                <td style={{ width: '100%' }}>
                  <span className="doc-label">LIBRETA MILITAR</span>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '3px' }}>
                    <div>
                      <span className="doc-radio" onClick={() => updateNestedPersonal('militaryService', 'bookClass', '1')}>
                        PRIMERA CLASE <span className={`doc-circle ${personalData.militaryService.bookClass === '1' ? 'checked' : ''}`}></span>
                      </span>
                      <span className="doc-radio" style={{ marginLeft: '15px' }} onClick={() => updateNestedPersonal('militaryService', 'bookClass', '2')}>
                        SEGUNDA CLASE <span className={`doc-circle ${personalData.militaryService.bookClass === '2' ? 'checked' : ''}`}></span>
                      </span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <span className="doc-label" style={{ display: 'inline' }}>NÚMERO:</span>
                      <input
                        type="text"
                        className="live-doc-input live-doc-underline"
                        style={{ width: '150px' }}
                        value={personalData.militaryService.number}
                        onChange={(e) => updateNestedPersonal('militaryService', 'number', e.target.value)}
                      />
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <span className="doc-label" style={{ display: 'inline' }}>D.M:</span>
                      <input
                        type="text"
                        className="live-doc-input live-doc-underline"
                        style={{ width: '70px' }}
                        value={personalData.militaryService.militaryDistrict}
                        onChange={(e) => updateNestedPersonal('militaryService', 'militaryDistrict', e.target.value)}
                      />
                    </div>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>

          {/* Row 4: NACIMIENTO & CORRESPONDENCIA (43.1% / 56.9%) */}
          <table className="doc-table" style={{ margin: 0, border: 'none' }}>
            <tbody>
              <tr>
                <td style={{ width: '43.1%' }}>
                  <span className="doc-label">FECHA Y LUGAR DE NACIMIENTO</span>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', margin: '4px 0 6px 0' }}>
                    <span style={{ fontSize: '7pt', fontWeight: 'bold' }}>FECHA</span>
                    <span style={{ fontSize: '6.5pt', display: 'flex', alignItems: 'center', gap: '4px' }}>
                      DÍA <SegmentedInput length={2} value={personalData.birthData.birthDay} onChange={(v) => updateNestedPersonal('birthData', 'birthDay', v)} />
                      MES <SegmentedInput length={2} value={personalData.birthData.birthMonth} onChange={(v) => updateNestedPersonal('birthData', 'birthMonth', v)} />
                      AÑO <SegmentedInput length={4} value={personalData.birthData.birthYear} onChange={(v) => updateNestedPersonal('birthData', 'birthYear', v)} />
                    </span>
                  </div>
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', marginBottom: '2px' }}>
                      <span className="doc-label" style={{ width: '60px' }}>PAÍS</span>
                      <input type="text" className="live-doc-input live-doc-underline" value={personalData.birthData.country} onChange={(e) => updateNestedPersonal('birthData', 'country', e.target.value.toUpperCase())} />
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', marginBottom: '2px' }}>
                      <span className="doc-label" style={{ width: '60px' }}>DEPTO</span>
                      <input type="text" className="live-doc-input live-doc-underline" value={personalData.birthData.state} onChange={(e) => updateNestedPersonal('birthData', 'state', e.target.value.toUpperCase())} />
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center' }}>
                      <span className="doc-label" style={{ width: '60px' }}>MUNICIPIO</span>
                      <input type="text" className="live-doc-input live-doc-underline" value={personalData.birthData.city} onChange={(e) => updateNestedPersonal('birthData', 'city', e.target.value.toUpperCase())} />
                    </div>
                  </div>
                </td>

                <td style={{ width: '56.9%' }}>
                  <span className="doc-label">DIRECCIÓN DE CORRESPONDENCIA</span>
                  <input type="text" className="live-doc-input live-doc-underline" style={{ margin: '2px 0 6px 0' }} value={personalData.contactAddress.address} onChange={(e) => updateNestedPersonal('contactAddress', 'address', e.target.value.toUpperCase())} />

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '6px' }}>
                    <div style={{ display: 'flex', alignItems: 'center' }}><span className="doc-label" style={{ width: '35px' }}>PAÍS</span> <input type="text" className="live-doc-input live-doc-underline" value={personalData.contactAddress.country} onChange={(e) => updateNestedPersonal('contactAddress', 'country', e.target.value.toUpperCase())} /></div>
                    <div style={{ display: 'flex', alignItems: 'center' }}><span className="doc-label" style={{ width: '40px' }}>DEPTO</span> <input type="text" className="live-doc-input live-doc-underline" value={personalData.contactAddress.state} onChange={(e) => updateNestedPersonal('contactAddress', 'state', e.target.value.toUpperCase())} /></div>
                    <div style={{ display: 'flex', alignItems: 'center' }}><span className="doc-label" style={{ width: '60px' }}>MUNICIPIO</span> <input type="text" className="live-doc-input live-doc-underline" value={personalData.contactAddress.city} onChange={(e) => updateNestedPersonal('contactAddress', 'city', e.target.value.toUpperCase())} /></div>
                    <div style={{ display: 'flex', alignItems: 'center' }}><span className="doc-label" style={{ width: '60px' }}>TELÉFONO</span> <input type="text" className="live-doc-input live-doc-underline" value={personalData.contactAddress.phone} onChange={(e) => updateNestedPersonal('contactAddress', 'phone', e.target.value)} /></div>
                  </div>
                  <div style={{ marginTop: '4px', display: 'flex', alignItems: 'center' }}>
                    <span className="doc-label" style={{ width: '40px' }}>EMAIL</span>
                    <input type="email" className="live-doc-input live-doc-underline" style={{ textTransform: 'none' }} value={personalData.contactAddress.email} onChange={(e) => updateNestedPersonal('contactAddress', 'email', e.target.value)} />
                    <span style={{ fontSize: '8pt', fontWeight: 'bold', marginLeft: '2px' }}>.</span>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Section 2: FORMACIÓN ACADÉMICA */}
        <div className="doc-section-badge">
          <div className="doc-section-num">2</div>
          <div className="doc-section-dash"></div>
          <div className="doc-section-title">FORMACIÓN ACADÉMICA</div>
        </div>

        {/* Educación Básica y Media Box */}
        <div className="doc-section-box">
          <div className="doc-instruction-text">
            <strong>EDUCACIÓN BÁSICA Y MEDIA</strong><br />
            MARQUE CON UNA X EL ÚLTIMO GRADO APROBADO ( LOS GRADOS DE 1o. A 6o. DE BACHILLERATO EQUIVALEN A LOS GRADOS 6o. A 11o. DE EDUCACIÓN BÁSICA SECUNDARIA Y MEDIA )
          </div>

          <div style={{ padding: '8px' }}>
            <table style={{ width: '92%', margin: '0 auto', borderCollapse: 'separate', borderSpacing: 0, border: '1px solid #000', borderRadius: '12px', overflow: 'hidden' }} className="bg-doc-tint">
              <thead>
                <tr>
                  <th colSpan={11} className="bg-doc-header" style={{ borderRight: '1px solid #000', borderBottom: '1px solid #000', fontSize: '7.5pt', fontStyle: 'italic', padding: '3px' }}>
                    EDUCACIÓN BÁSICA
                  </th>
                  <th colSpan={3} className="bg-doc-tint" style={{ borderBottom: '1px solid #000', fontSize: '7.5pt', fontStyle: 'italic', textAlign: 'left', padding: '2px 6px' }}>
                    <div style={{ display: 'flex', alignItems: 'center' }}>
                      <span style={{ fontStyle: 'italic', fontWeight: 'bold', fontSize: '7.5pt', whiteSpace: 'nowrap' }}>TÍTULO OBTENIDO:</span>
                      <input
                        type="text"
                        className="live-doc-input"
                        style={{ marginLeft: '4px', flex: 1, fontSize: '8pt', fontStyle: 'normal' }}
                        value={educationData.basic.titleObtained}
                        onChange={(e) => updateBasicEducation('titleObtained', e.target.value.toUpperCase())}
                      />
                    </div>
                  </th>
                </tr>
                <tr>
                  <th colSpan={5} className="bg-doc-subheader" style={{ borderRight: '1px solid #000', borderBottom: '1px solid #000', fontSize: '6.5pt', fontStyle: 'italic' }}>PRIMARIA</th>
                  <th colSpan={4} className="bg-doc-subheader" style={{ borderRight: '1px solid #000', borderBottom: '1px solid #000', fontSize: '6.5pt', fontStyle: 'italic' }}>SECUNDARIA</th>
                  <th colSpan={2} className="bg-doc-subheader" style={{ borderRight: '1px solid #000', borderBottom: '1px solid #000', fontSize: '6.5pt', fontStyle: 'italic' }}>MEDIA</th>
                  <th colSpan={3} className="bg-doc-subheader" style={{ borderBottom: '1px solid #000', fontSize: '7.5pt', fontStyle: 'italic' }}>FECHA DE GRADO</th>
                </tr>
              </thead>
              <tbody>
                <tr style={{ textAlign: 'center', height: '26px' }}>
                  {[1, 2, 3, 4, 5].map((grado) => (
                    <td
                      key={grado}
                      className={educationData.basic.lastGrade === grado ? 'bg-doc-header' : 'bg-doc-tint'}
                      style={{
                        borderRight: '1px solid #000',
                        width: '22px',
                        fontSize: '7.5pt',
                        fontWeight: 'bold',
                        cursor: 'pointer',
                      }}
                      onClick={() => updateBasicEducation('lastGrade', educationData.basic.lastGrade === grado ? null : grado)}
                      title={`Haga clic para marcar grado ${grado}`}
                    >
                      {educationData.basic.lastGrade === grado ? 'X' : `${grado}o.`}
                    </td>
                  ))}
                  {[6, 7, 8, 9].map((grado) => (
                    <td
                      key={grado}
                      className={educationData.basic.lastGrade === grado ? 'bg-doc-header' : 'bg-doc-tint'}
                      style={{
                        borderRight: '1px solid #000',
                        width: '22px',
                        fontSize: '7.5pt',
                        fontWeight: 'bold',
                        cursor: 'pointer',
                      }}
                      onClick={() => updateBasicEducation('lastGrade', educationData.basic.lastGrade === grado ? null : grado)}
                      title={`Haga clic para marcar grado ${grado}`}
                    >
                      {educationData.basic.lastGrade === grado ? 'X' : `${grado}o.`}
                    </td>
                  ))}
                  {[10, 11].map((grado) => (
                    <td
                      key={grado}
                      className={educationData.basic.lastGrade === grado ? 'bg-doc-header' : 'bg-doc-tint'}
                      style={{
                        borderRight: '1px solid #000',
                        width: '22px',
                        fontSize: '7.5pt',
                        fontWeight: 'bold',
                        cursor: 'pointer',
                      }}
                      onClick={() => updateBasicEducation('lastGrade', educationData.basic.lastGrade === grado ? null : grado)}
                      title={`Haga clic para marcar grado ${grado}`}
                    >
                      {educationData.basic.lastGrade === grado ? 'X' : `${grado}`}
                    </td>
                  ))}
                  <td colSpan={3} className="bg-doc-tint" style={{ padding: '3px 8px', fontSize: '7.5pt', fontWeight: 'bold' }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '20px' }}>
                      <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
                        MES <SegmentedInput length={2} value={educationData.basic.graduationMonth} onChange={(v) => updateBasicEducation('graduationMonth', v)} />
                      </span>
                      <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
                        AÑO <SegmentedInput length={4} value={educationData.basic.graduationYear} onChange={(v) => updateBasicEducation('graduationYear', v)} />
                      </span>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Educación Superior Box */}
        <div className="doc-section-box">
          <div className="doc-instruction-text" style={{ padding: '4px 6px' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '2px' }}>
              <span style={{ fontWeight: 'bold', fontStyle: 'italic', fontSize: '7pt' }}>
                EDUCACION SUPERIOR (PREGRADO Y POSTGRADO)
              </span>
              <button type="button" onClick={addHigherItem} className="inline-doc-action no-print">
                <Plus size={12} /> Agregar Estudio
              </button>
            </div>

            <div style={{ fontSize: '6.5pt', lineHeight: '1.35', fontWeight: 'normal' }}>
              <div style={{ marginBottom: '2px' }}>
                DILIGENCIE ESTE PUNTO EN ESTRICTO ORDEN CRONOLÓGICO, EN MODALIDAD ACADÉMICA ESCRIBA:
              </div>

              {/* Tabulated 4-column grid matching header_edu.png */}
              <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1.3fr 1.8fr 1.4fr', gap: '1px 8px', margin: '2px 0 3px 0' }}>
                <div><strong style={{ fontWeight: 'bold' }}>TC</strong> (TÉCNICA),</div>
                <div><strong style={{ fontWeight: 'bold' }}>TL</strong> (TECNOLÓGICA),</div>
                <div><strong style={{ fontWeight: 'bold' }}>TE</strong> (TECNOLÓGICA ESPECIALIZADA),</div>
                <div><strong style={{ fontWeight: 'bold' }}>UN</strong> (UNIVERSITARIA),</div>
                <div><strong style={{ fontWeight: 'bold' }}>ES</strong> (ESPECIALIZACIÓN),</div>
                <div><strong style={{ fontWeight: 'bold' }}>MG</strong> (MAESTRÍA O MAGISTER),</div>
                <div><strong style={{ fontWeight: 'bold' }}>DOC</strong> (DOCTORADO O PHD),</div>
                <div></div>
              </div>

              <div>
                RELACIONE AL FRENTE EL NÚMERO DE LA TARJETA PROFESIONAL (SI ÉSTA HA SIDO PREVISTA EN UNA LEY).
              </div>
            </div>
          </div>

          <table className="doc-table" style={{ margin: 0, border: 'none' }}>
            <thead>
              <tr>
                <th rowSpan={2} style={{ width: '10.5%' }}>MODALIDAD ACADÉMICA</th>
                <th rowSpan={2} style={{ width: '13.5%' }}>No.SEMESTRES APROBADOS</th>
                <th colSpan={2} style={{ width: '10%' }}>GRADUADO</th>
                <th rowSpan={2} style={{ width: '34%' }}>NOMBRE DE LOS ESTUDIOS O TÍTULO OBTENIDO</th>
                <th colSpan={2} style={{ width: '15%' }}>TERMINACIÓN</th>
                <th rowSpan={2} style={{ width: '17%' }}>No. DE TARJETA PROFESIONAL</th>
              </tr>
              <tr className="bg-doc-header">
                <th className="bg-doc-header" style={{ width: '5%', fontSize: '6.5pt' }}>SI</th>
                <th className="bg-doc-header" style={{ width: '5%', fontSize: '6.5pt' }}>NO</th>
                <th className="bg-doc-header" style={{ width: '5%', fontSize: '6.5pt' }}>MES</th>
                <th className="bg-doc-header" style={{ width: '10%', fontSize: '6.5pt' }}>AÑO</th>
              </tr>
            </thead>
            <tbody>
              {Array.from({ length: Math.max(5, educationData.higher.length) }).map((_, i) => {
                const item = educationData.higher[i];
                return (
                  <tr key={i} style={{ height: '22px' }}>
                    <td className="doc-value-center" style={{ padding: 0, textAlign: 'center' }}>
                      {item ? (
                        <select
                          className="live-doc-select live-doc-input-center"
                          value={item.degreeType}
                          onChange={(e) => updateHigherItem(i, 'degreeType', e.target.value as AcademicDegreeType)}
                        >
                          <option value="TC">TC</option>
                          <option value="TL">TL</option>
                          <option value="TE">TE</option>
                          <option value="UN">UN</option>
                          <option value="ES">ES</option>
                          <option value="MG">MG</option>
                          <option value="DOC">DOC</option>
                        </select>
                      ) : null}
                    </td>
                    <td className="doc-value-center" style={{ padding: 0, textAlign: 'center' }}>
                      {item ? (
                        <input
                          type="text"
                          className="live-doc-input live-doc-input-center"
                          value={item.approvedSemesters}
                          onChange={(e) => updateHigherItem(i, 'approvedSemesters', e.target.value)}
                        />
                      ) : null}
                    </td>
                    <td className="doc-value-center" style={{ width: '5%', textAlign: 'center', cursor: 'pointer', fontWeight: 'bold' }} onClick={() => item && updateHigherItem(i, 'isGraduated', 'SI')}>
                      {item?.isGraduated === 'SI' ? 'X' : ''}
                    </td>
                    <td className="doc-value-center" style={{ width: '5%', textAlign: 'center', cursor: 'pointer', fontWeight: 'bold' }} onClick={() => item && updateHigherItem(i, 'isGraduated', 'NO')}>
                      {item?.isGraduated === 'NO' ? 'X' : ''}
                    </td>
                    <td style={{ padding: 0 }}>
                      {item ? (
                        <input
                          type="text"
                          className="live-doc-input"
                          style={{ fontSize: '7.5pt' }}
                          value={item.studyName}
                          onChange={(e) => updateHigherItem(i, 'studyName', e.target.value.toUpperCase())}
                        />
                      ) : null}
                    </td>
                    <td className="doc-value-center" style={{ width: '5%', padding: '2px 0', textAlign: 'center' }}>
                      {item ? (
                        <div style={{ display: 'flex', justifyContent: 'center' }}>
                          <SegmentedInput length={2} value={item.endMonth} onChange={(v) => updateHigherItem(i, 'endMonth', v)} />
                        </div>
                      ) : null}
                    </td>
                    <td className="doc-value-center" style={{ width: '10%', padding: '2px 0', textAlign: 'center' }}>
                      {item ? (
                        <div style={{ display: 'flex', justifyContent: 'center' }}>
                          <SegmentedInput length={4} value={item.endYear} onChange={(v) => updateHigherItem(i, 'endYear', v)} />
                        </div>
                      ) : null}
                    </td>
                    <td style={{ padding: 0 }}>
                      {item ? (
                        <div style={{ display: 'flex', alignItems: 'center' }}>
                          <input
                            type="text"
                            className="live-doc-input"
                            value={item.professionalCardNumber}
                            onChange={(e) => updateHigherItem(i, 'professionalCardNumber', e.target.value.toUpperCase())}
                          />
                          <button
                            type="button"
                            onClick={() => removeHigherItem(i)}
                            className="no-print p-0.5 text-red-500 hover:text-red-700 hover:bg-red-50 rounded mr-1"
                            title="Eliminar este estudio"
                          >
                            <Trash2 size={12} />
                          </button>
                        </div>
                      ) : null}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Idiomas Box */}
        <div className="doc-section-box">
          <div className="doc-instruction-text" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div>
              ESPECÍFIQUE LOS IDIOMAS DIFERENTES AL ESPAÑOL QUE: HABLA, LEE, ESCRIBE DE FORMA, REGULAR (R), BIEN (B) O MUY BIEN (MB)
            </div>
            <button type="button" onClick={addLanguageItem} className="inline-doc-action no-print">
              <Plus size={12} /> Agregar Idioma
            </button>
          </div>

          <div style={{ padding: '8px' }}>
            <table style={{ width: '78%', margin: '0 auto' }} className="doc-custom-table">
              <thead>
                <tr>
                  <th rowSpan={2} className="bg-doc-header" style={{ width: '38%', fontSize: '7pt' }}>IDIOMA</th>
                  <th colSpan={3} className="bg-doc-header" style={{ fontSize: '6.5pt' }}>LO HABLA</th>
                  <th colSpan={3} className="bg-doc-header" style={{ fontSize: '6.5pt' }}>LO LEE</th>
                  <th colSpan={3} className="bg-doc-header" style={{ fontSize: '6.5pt' }}>LO ESCRIBE</th>
                </tr>
                <tr className="bg-doc-header" style={{ fontSize: '6pt', textAlign: 'center' }}>
                  <th className="bg-doc-header" style={{ width: '6.88%' }}>R</th>
                  <th className="bg-doc-header" style={{ width: '6.88%' }}>B</th>
                  <th className="bg-doc-header" style={{ width: '6.88%' }}>MB</th>
                  <th className="bg-doc-header" style={{ width: '6.88%' }}>R</th>
                  <th className="bg-doc-header" style={{ width: '6.88%' }}>B</th>
                  <th className="bg-doc-header" style={{ width: '6.88%' }}>MB</th>
                  <th className="bg-doc-header" style={{ width: '6.88%' }}>R</th>
                  <th className="bg-doc-header" style={{ width: '6.88%' }}>B</th>
                  <th className="bg-doc-header" style={{ width: '6.88%' }}>MB</th>
                </tr>
              </thead>
              <tbody>
                {Array.from({ length: Math.max(3, educationData.languages.length) }).map((_, i) => {
                  const lang = educationData.languages[i];
                  return (
                    <tr key={i} style={{ height: '20px', textAlign: 'center', fontSize: '7pt' }}>
                      <td style={{ padding: 0 }}>
                        {lang ? (
                          <div style={{ display: 'flex', alignItems: 'center' }}>
                            <input
                              type="text"
                              className="live-doc-input"
                              value={lang.language}
                              onChange={(e) => updateLanguageItem(i, 'language', e.target.value.toUpperCase())}
                            />
                            <button
                              type="button"
                              onClick={() => removeLanguageItem(i)}
                              className="no-print p-0.5 text-red-500 hover:text-red-700 hover:bg-red-50 rounded mr-1"
                              title="Eliminar idioma"
                            >
                              <Trash2 size={12} />
                            </button>
                          </div>
                        ) : null}
                      </td>

                      <td style={{ cursor: 'pointer' }} onClick={() => lang && updateLanguageItem(i, 'speaks', 'R')}>{lang?.speaks === 'R' ? 'X' : ''}</td>
                      <td style={{ cursor: 'pointer' }} onClick={() => lang && updateLanguageItem(i, 'speaks', 'B')}>{lang?.speaks === 'B' ? 'X' : ''}</td>
                      <td style={{ cursor: 'pointer' }} onClick={() => lang && updateLanguageItem(i, 'speaks', 'MB')}>{lang?.speaks === 'MB' ? 'X' : ''}</td>

                      <td style={{ cursor: 'pointer' }} onClick={() => lang && updateLanguageItem(i, 'reads', 'R')}>{lang?.reads === 'R' ? 'X' : ''}</td>
                      <td style={{ cursor: 'pointer' }} onClick={() => lang && updateLanguageItem(i, 'reads', 'B')}>{lang?.reads === 'B' ? 'X' : ''}</td>
                      <td style={{ cursor: 'pointer' }} onClick={() => lang && updateLanguageItem(i, 'reads', 'MB')}>{lang?.reads === 'MB' ? 'X' : ''}</td>

                      <td style={{ cursor: 'pointer' }} onClick={() => lang && updateLanguageItem(i, 'writes', 'R')}>{lang?.writes === 'R' ? 'X' : ''}</td>
                      <td style={{ cursor: 'pointer' }} onClick={() => lang && updateLanguageItem(i, 'writes', 'B')}>{lang?.writes === 'B' ? 'X' : ''}</td>
                      <td style={{ cursor: 'pointer' }} onClick={() => lang && updateLanguageItem(i, 'writes', 'MB')}>{lang?.writes === 'MB' ? 'X' : ''}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Page Footer */}
        <div className="doc-footer-page">
          <div></div>
          <div style={{ fontSize: '10pt', fontWeight: 'bold' }}>1</div>
        </div>
      </div>


      {/* ==================== PAGE 2+ (Experiencia Laboral Pages) ==================== */}
      {expPages.map((chunk, pageIndex) => (
        <div key={pageIndex} className="cv-page">
          {/* Header Title */}
          <div style={{ textAlign: 'center', marginBottom: '8px' }}>
            <h2 style={{ fontSize: '12pt', fontWeight: 'bold', margin: 0, textTransform: 'uppercase' }}>FORMATO ÚNICO</h2>
            <h1 style={{ fontSize: '14pt', fontWeight: '900', margin: 0, textTransform: 'uppercase' }}>HOJA DE VIDA</h1>
            <p style={{ fontSize: '8.5pt', fontWeight: 'bold', margin: 0 }}>Persona Natural</p>
            <span style={{ fontSize: '7pt', fontStyle: 'italic' }}>(Leyes 190 de 1995, 489 y 443 de 1998)</span>
          </div>

          {/* Section 3: EXPERIENCIA LABORAL */}
          <div className="doc-section-badge" style={{ justifyContent: 'space-between' }}>
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <div className="doc-section-num">3</div>
              <div className="doc-section-dash"></div>
              <div className="doc-section-title">EXPERIENCIA LABORAL</div>
            </div>
            <div className="no-print flex items-center gap-2">
              <button type="button" onClick={addExperiencePage} className="inline-doc-action">
                <Plus size={12} /> Añadir Página de Experiencia
              </button>
              {pageIndex > 0 && (
                <button
                  type="button"
                  onClick={() => removeExperiencePage(pageIndex)}
                  className="inline-doc-action"
                  style={{ color: '#ef4444', background: '#fef2f2', borderColor: '#fca5a5' }}
                  title="Eliminar esta página de experiencia"
                >
                  <Trash2 size={12} /> Eliminar Esta Página
                </button>
              )}
            </div>
          </div>

          <div style={{ fontSize: '7pt', fontWeight: 'bold', marginBottom: '6px', textTransform: 'uppercase' }}>
            RELACIONE SU EXPERIENCIA LABORAL O DE PRESTACIÓN DE SERVICIOS EN ESTRICTO ORDEN CRONOLÓGICO COMENZANDO POR EL ACTUAL.
          </div>

          {/* Render 4 Experience Blocks per page */}
          <div className="doc-section-box">
            {Array.from({ length: 4 }).map((_, blockIndex) => {
              const globalIndex = pageIndex * expChunkSize + blockIndex;
              const exp = workExperience[globalIndex];
              const isFirstBlockOfPage1 = pageIndex === 0 && blockIndex === 0;
              const titleText = isFirstBlockOfPage1
                ? 'EMPLEO ACTUAL O CONTRATO VIGENTE'
                : 'EMPLEO O CONTRATO ANTERIOR';

              return (
                <div key={blockIndex} style={{ borderBottom: blockIndex < 3 ? '1.5px solid #000' : 'none' }}>
                  {/* Block Header */}
                  <div className="doc-emp-block-header">
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
                      <span>{titleText}</span>
                      {exp && (
                        <span className="no-print" style={{ fontStyle: 'normal', fontSize: '6.5pt' }}>
                          <button type="button" onClick={() => moveExperienceUp(globalIndex)} disabled={globalIndex === 0} className="p-0.5 hover:text-sky-600 disabled:opacity-30" title="Subir"><ArrowUp size={11} /></button>
                          <button type="button" onClick={() => moveExperienceDown(globalIndex)} disabled={globalIndex === workExperience.length - 1} className="p-0.5 hover:text-sky-600 disabled:opacity-30" title="Bajar"><ArrowDown size={11} /></button>
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Row 1: EMPRESA O ENTIDAD (46%) | PÚBLICA / PRIVADA / INDEPENDIENTE (36%) | PAÍS (18%) */}
                  <div className="doc-emp-flex-row">
                    <div className="doc-emp-col" style={{ width: '46%' }}>
                      <span className="doc-label" style={{ paddingLeft: '4px' }}>EMPRESA O ENTIDAD</span>
                      <input
                        type="text"
                        className="live-doc-input"
                        value={exp?.companyName || ''}
                        onChange={(e) => handleCompanyNameChange(globalIndex, e.target.value)}
                      />
                    </div>
                    <div className="doc-emp-col flex items-center justify-center whitespace-nowrap text-center px-1" style={{ width: '36%' }}>
                      <span className="doc-radio mr-1" onClick={() => exp && updateExperienceItem(globalIndex, 'companyType', 'PUBLICA')}>
                        PÚBLICA <span className="doc-box-check">{exp?.companyName?.trim() && exp?.companyType === 'PUBLICA' ? 'X' : ''}</span>
                      </span>
                      <span className="doc-radio mr-1" onClick={() => exp && updateExperienceItem(globalIndex, 'companyType', 'PRIVADA')}>
                        PRIVADA <span className="doc-box-check">{exp?.companyName?.trim() && exp?.companyType === 'PRIVADA' ? 'X' : ''}</span>
                      </span>
                      <span className="doc-radio" style={{ marginRight: 0 }} onClick={() => exp && updateExperienceItem(globalIndex, 'companyType', 'INDEPENDIENTE')}>
                        INDEPENDIENTE <span className="doc-box-check">{exp?.companyName?.trim() && exp?.companyType === 'INDEPENDIENTE' ? 'X' : ''}</span>
                      </span>
                    </div>
                    <div className="doc-emp-col" style={{ width: '18%' }}>
                      <span className="doc-label" style={{ paddingLeft: '4px' }}>PAÍS</span>
                      <input
                        type="text"
                        className="live-doc-input"
                        value={exp?.country || ''}
                        onChange={(e) => exp && updateExperienceItem(globalIndex, 'country', e.target.value.toUpperCase())}
                      />
                    </div>
                  </div>

                  {/* Row 2: DEPARTAMENTO (35%) | MUNICIPIO (30%) | CORREO ELECTRÓNICO (35%) */}
                  <div className="doc-emp-flex-row">
                    <div className="doc-emp-col" style={{ width: '35%' }}>
                      <span className="doc-label" style={{ paddingLeft: '4px' }}>DEPARTAMENTO</span>
                      <input
                        type="text"
                        className="live-doc-input"
                        value={exp?.state || ''}
                        onChange={(e) => exp && updateExperienceItem(globalIndex, 'state', e.target.value.toUpperCase())}
                      />
                    </div>
                    <div className="doc-emp-col" style={{ width: '30%' }}>
                      <span className="doc-label" style={{ paddingLeft: '4px' }}>MUNICIPIO</span>
                      <input
                        type="text"
                        className="live-doc-input"
                        value={exp?.city || ''}
                        onChange={(e) => exp && updateExperienceItem(globalIndex, 'city', e.target.value.toUpperCase())}
                      />
                    </div>
                    <div className="doc-emp-col" style={{ width: '35%' }}>
                      <span className="doc-label" style={{ paddingLeft: '4px' }}>CORREO ELECTRÓNICO ENTIDAD</span>
                      <input
                        type="email"
                        className="live-doc-input"
                        style={{ textTransform: 'none' }}
                        value={exp?.companyEmail || ''}
                        onChange={(e) => exp && updateExperienceItem(globalIndex, 'companyEmail', e.target.value)}
                      />
                    </div>
                  </div>

                  {/* Row 3: TELÉFONOS (30%) | FECHA DE INGRESO & RETIRO (70%) */}
                  <div className="doc-emp-flex-row">
                    <div className="doc-emp-col" style={{ width: '30%' }}>
                      <span className="doc-label" style={{ paddingLeft: '4px' }}>TELÉFONOS</span>
                      <input
                        type="text"
                        className="live-doc-input"
                        value={exp?.phoneNumbers || ''}
                        onChange={(e) => exp && updateExperienceItem(globalIndex, 'phoneNumbers', e.target.value)}
                      />
                    </div>
                    <div className="doc-emp-col px-1.5 py-0.5" style={{ width: '70%' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                        <div>
                          <span className="doc-label">FECHA DE INGRESO</span>
                          <div style={{ fontSize: '6.5pt', display: 'flex', alignItems: 'center', gap: '4px', marginTop: '2px' }}>
                            DÍA <SegmentedInput length={2} value={exp?.startDate.day || ''} onChange={(v) => exp && updateExperienceDate(globalIndex, 'startDate', 'day', v)} />
                            MES <SegmentedInput length={2} value={exp?.startDate.month || ''} onChange={(v) => exp && updateExperienceDate(globalIndex, 'startDate', 'month', v)} />
                            AÑO <SegmentedInput length={4} value={exp?.startDate.year || ''} onChange={(v) => exp && updateExperienceDate(globalIndex, 'startDate', 'year', v)} />
                          </div>
                        </div>

                        <div>
                          <span className="doc-label">FECHA DE RETIRO</span>
                          <div style={{ fontSize: '6.5pt' }}>
                            {globalIndex !== 0 ? (
                              <div style={{ fontSize: '6.5pt', display: 'flex', alignItems: 'center', gap: '4px', marginTop: '2px' }}>
                                DÍA <SegmentedInput length={2} value={exp?.endDate.day || ''} onChange={(v) => exp && updateExperienceDate(globalIndex, 'endDate', 'day', v)} />
                                MES <SegmentedInput length={2} value={exp?.endDate.month || ''} onChange={(v) => exp && updateExperienceDate(globalIndex, 'endDate', 'month', v)} />
                                AÑO <SegmentedInput length={4} value={exp?.endDate.year || ''} onChange={(v) => exp && updateExperienceDate(globalIndex, 'endDate', 'year', v)} />
                              </div>
                            ) : (
                              <span className="italic text-slate-500 font-bold">(EMPLEO ACTUAL)</span>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Row 4: CARGO O CONTRATO (35%) | DEPENDENCIA (30%) | DIRECCIÓN (35%) */}
                  <div className="doc-emp-flex-row">
                    <div className="doc-emp-col" style={{ width: '35%' }}>
                      <span className="doc-label" style={{ paddingLeft: '4px' }}>{isFirstBlockOfPage1 ? 'CARGO O CONTRATO ACTUAL' : 'CARGO O CONTRATO'}</span>
                      <input
                        type="text"
                        className="live-doc-input"
                        value={exp?.jobTitle || ''}
                        onChange={(e) => exp && updateExperienceItem(globalIndex, 'jobTitle', e.target.value.toUpperCase())}
                      />
                    </div>
                    <div className="doc-emp-col" style={{ width: '30%' }}>
                      <span className="doc-label" style={{ paddingLeft: '4px' }}>DEPENDENCIA</span>
                      <input
                        type="text"
                        className="live-doc-input"
                        value={exp?.department || ''}
                        onChange={(e) => exp && updateExperienceItem(globalIndex, 'department', e.target.value.toUpperCase())}
                      />
                    </div>
                    <div className="doc-emp-col" style={{ width: '35%' }}>
                      <span className="doc-label" style={{ paddingLeft: '4px' }}>DIRECCIÓN</span>
                      <input
                        type="text"
                        className="live-doc-input"
                        value={exp?.address || ''}
                        onChange={(e) => exp && updateExperienceItem(globalIndex, 'address', e.target.value.toUpperCase())}
                      />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Page Footer */}
          <div className="doc-footer-page">
            <div></div>
            <div style={{ fontSize: '10pt', fontWeight: 'bold' }}>{pageIndex + 2}</div>
          </div>
        </div>
      ))}


      {/* ==================== PAGE 3 (Final Page) ==================== */}
      <div className="cv-page">
        {/* Header Title */}
        <div style={{ textAlign: 'center', marginBottom: '8px' }}>
          <h2 style={{ fontSize: '12pt', fontWeight: 'bold', margin: 0, textTransform: 'uppercase' }}>FORMATO ÚNICO</h2>
          <h1 style={{ fontSize: '14pt', fontWeight: '900', margin: 0, textTransform: 'uppercase' }}>HOJA DE VIDA</h1>
          <p style={{ fontSize: '8.5pt', fontWeight: 'bold', margin: 0 }}>Persona Natural</p>
          <span style={{ fontSize: '7pt', fontStyle: 'italic' }}>(Leyes 190 de 1995, 489 y 443 de 1998)</span>
        </div>

        {/* Section 4: TIEMPO TOTAL DE EXPERIENCIA */}
        <div className="doc-section-badge">
          <div className="doc-section-num">4</div>
          <div className="doc-section-dash"></div>
          <div className="doc-section-title">TIEMPO TOTAL DE EXPERIENCIA</div>
        </div>

        <div className="doc-section-box" style={{ marginBottom: '14px' }}>
          <div className="doc-instruction-text">
            INDIQUE EL TIEMPO TOTAL DE SU EXPERIENCIA LABORAL EN NÚMERO DE AÑOS Y MESES.
          </div>

          {(() => {
            const getCategoryTime = (type: 'PUBLICA' | 'PRIVADA' | 'INDEPENDIENTE') => {
              let totalMonths = 0;
              const now = new Date();
              const currentYear = now.getFullYear();
              const currentMonth = now.getMonth() + 1;
              const currentDay = now.getDate();

              workExperience.forEach((exp, idx) => {
                if (exp.companyType !== type || !exp.companyName?.trim()) return;

                const startY = parseInt(exp.startDate.year, 10);
                const startM = parseInt(exp.startDate.month, 10);
                const startD = parseInt(exp.startDate.day, 10) || 1;

                if (isNaN(startY) || isNaN(startM) || startM < 1 || startM > 12) return;

                let endY = currentYear;
                let endM = currentMonth;
                let endD = currentDay;

                if (idx !== 0 && !exp.isCurrent) {
                  endY = parseInt(exp.endDate.year, 10);
                  endM = parseInt(exp.endDate.month, 10);
                  endD = parseInt(exp.endDate.day, 10) || 30;
                  if (isNaN(endY) || isNaN(endM) || endM < 1 || endM > 12) return;
                }

                let months = (endY - startY) * 12 + (endM - startM);
                if (endD < startD) {
                  months -= 1;
                }
                if (months > 0) {
                  totalMonths += months;
                }
              });

              return {
                years: Math.floor(totalMonths / 12),
                months: totalMonths % 12,
                rawMonths: totalMonths,
              };
            };

            const pub = getCategoryTime('PUBLICA');
            const priv = getCategoryTime('PRIVADA');
            const indep = getCategoryTime('INDEPENDIENTE');
            const totalRaw = pub.rawMonths + priv.rawMonths + indep.rawMonths;
            const grandYears = Math.floor(totalRaw / 12);
            const grandMonths = totalRaw % 12;

            return (
              <div style={{ padding: '8px' }}>
                <table style={{ width: '83%', margin: '0 auto' }} className="doc-custom-table">
                  <thead>
                    <tr>
                      <th rowSpan={2} className="bg-doc-header" style={{ width: '60%', fontSize: '7.5pt' }}>OCUPACIÓN</th>
                      <th colSpan={2} className="bg-doc-header" style={{ fontSize: '7.5pt' }}>TIEMPO DE EXPERIENCIA</th>
                    </tr>
                    <tr className="bg-doc-header" style={{ fontSize: '7pt', textAlign: 'center' }}>
                      <th className="bg-doc-header" style={{ width: '20%' }}>AÑOS</th>
                      <th className="bg-doc-header" style={{ width: '20%' }}>MESES</th>
                    </tr>
                  </thead>
                  <tbody style={{ fontSize: '8pt' }}>
                    <tr>
                      <td className="bg-doc-tint" style={{ padding: '4px', fontStyle: 'italic' }}>SERVIDOR PÚBLICO</td>
                      <td className="bg-doc-tint" style={{ textAlign: 'center', fontWeight: 'bold' }}>{pub.years}</td>
                      <td className="bg-doc-tint" style={{ textAlign: 'center', fontWeight: 'bold' }}>{pub.months}</td>
                    </tr>
                    <tr>
                      <td className="bg-doc-tint" style={{ padding: '4px', fontStyle: 'italic' }}>EMPLEADO DEL SECTOR PRIVADO</td>
                      <td className="bg-doc-tint" style={{ textAlign: 'center', fontWeight: 'bold' }}>{priv.years}</td>
                      <td className="bg-doc-tint" style={{ textAlign: 'center', fontWeight: 'bold' }}>{priv.months}</td>
                    </tr>
                    <tr>
                      <td className="bg-doc-tint" style={{ padding: '4px', fontStyle: 'italic' }}>TRABAJADOR INDEPENDIENTE</td>
                      <td className="bg-doc-tint" style={{ textAlign: 'center', fontWeight: 'bold' }}>{indep.years}</td>
                      <td className="bg-doc-tint" style={{ textAlign: 'center', fontWeight: 'bold' }}>{indep.months}</td>
                    </tr>
                    <tr className="bg-doc-subheader">
                      <td className="bg-doc-subheader" style={{ padding: '4px', fontWeight: 'bold' }}>TOTAL TIEMPO EXPERIENCIA</td>
                      <td className="bg-doc-subheader" style={{ textAlign: 'center', fontWeight: 'extrabold', fontSize: '9pt' }}>{grandYears}</td>
                      <td className="bg-doc-subheader" style={{ textAlign: 'center', fontWeight: 'extrabold', fontSize: '9pt' }}>{grandMonths}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            );
          })()}
        </div>

        {/* Section 5: FIRMA DEL SERVIDOR PÚBLICO O CONTRATISTA */}
        <div className="doc-section-badge">
          <div className="doc-section-num">5</div>
          <div className="doc-section-dash"></div>
          <div className="doc-section-title">FIRMA DEL SERVIDOR PÚBLICO O CONTRATISTA</div>
        </div>

        <div className="doc-section-box" style={{ padding: '8px', marginBottom: '14px' }}>
          <div style={{ fontSize: '7.5pt', lineHeight: '1.6', marginBottom: '10px' }}>
            MANIFIESTO BAJO LA GRAVEDAD DEL JURAMENTO QUE&nbsp;
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', cursor: 'pointer', margin: '0 6px 0 2px' }} onClick={() => updateData((prev) => ({ ...prev, signature: { ...prev.signature, disqualification: 'SI' } }))}>
              <strong style={{ fontSize: '7.5pt' }}>SI</strong>
              <span className="doc-checkbox-square">
                {signature.disqualification === 'SI' ? 'X' : ''}
              </span>
            </span>
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', cursor: 'pointer', margin: '0 6px 0 0' }} onClick={() => updateData((prev) => ({ ...prev, signature: { ...prev.signature, disqualification: 'NO' } }))}>
              <strong style={{ fontSize: '7.5pt' }}>NO</strong>
              <span className="doc-checkbox-square">
                {signature.disqualification === 'NO' ? 'X' : ''}
              </span>
            </span>
            &nbsp;ME ENCUENTRO DENTRO DE LAS CAUSALES DE INHABILIDAD E INCOMPATIBILIDAD DEL ORDEN CONSTITUCIONAL O LEGAL, PARA EJERCER CARGOS EMPLEOS PÚBLICOS O PARA CELEBRAR CONTRATOS DE PRESTACIÓN DE SERVICIOS CON LA ADMINISTRACIÓN PÚBLICA.<br /><br />
            PARA TODOS LOS EFECTOS LEGALES, CERTIFICO QUE LOS DATOS POR MI ANOTADOS EN EL PRESENTE FORMATO ÚNICO DE HOJA DE VIDA, SON VERACES, (ARTÍCULO 5o. DE LA LEY 190/95).
          </div>

          <div style={{ marginTop: '15px', fontSize: '8pt', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span>Ciudad y fecha de diligenciamiento</span>
            <input
              type="text"
              className="live-doc-input live-doc-underline"
              style={{ flex: 1, fontWeight: 'bold' }}
              value={signature.dateAndCity}
              onChange={(e) => updateData((prev) => ({ ...prev, signature: { ...prev.signature, dateAndCity: e.target.value.toUpperCase() } }))}
            />
          </div>

          {/* Interactive Signature Area */}
          <div style={{ marginTop: '25px', textAlign: 'center' }}>
            <div
              className="doc-signature-box"
              style={{ width: '60%', margin: '0 auto 4px auto' }}
              onClick={() => setShowSignatureModal(true)}
              title="Haga clic para firmar o editar la firma digital"
            >
              {signature.signatureType === 'TEXT' && signature.signatureData && (
                <span className="doc-signature-text">{signature.signatureData}</span>
              )}
              {(signature.signatureType === 'DRAW' || signature.signatureType === 'IMAGE') && signature.signatureData && (
                <img src={signature.signatureData} alt="Firma digital" className="doc-signature-img" />
              )}
              {!signature.signatureData && (
                <span className="text-xs text-sky-600 font-bold flex items-center gap-1 no-print">
                  <PenTool size={14} /> Haga clic aquí para Firmar
                </span>
              )}
            </div>
            <div style={{ borderTop: '1px solid #000', width: '60%', margin: '0 auto', fontSize: '7pt', fontWeight: 'bold', paddingTop: '2px' }}>
              FIRMA DEL SERVIDOR PÚBLICO O CONTRATISTA
            </div>
          </div>
        </div>

        {/* Section 6: OBSERVACIONES DEL JEFE DE RECURSOS HUMANOS Y/O CONTRATOS */}
        <div className="doc-section-badge">
          <div className="doc-section-num">6</div>
          <div className="doc-section-dash"></div>
          <div className="doc-section-title">OBSERVACIONES DEL JEFE DE RECURSOS HUMANOS Y/O CONTRATOS</div>
        </div>

        <div className="doc-section-box" style={{ padding: '8px' }}>
          <div className="bg-doc-tint" style={{ border: '1px solid #999', borderRadius: '12px', minHeight: '60px', padding: '4px', marginBottom: '6px' }}>
            <textarea
              className="live-doc-textarea"
              style={{ minHeight: '52px', fontSize: '8pt' }}
              value={hrObservations.observations}
              onChange={(e) => updateData((prev) => ({ ...prev, hrObservations: { ...prev.hrObservations, observations: e.target.value.toUpperCase() } }))}
            />
          </div>

          <div style={{ fontSize: '7pt', marginBottom: '10px' }}>
            CERTIFICO QUE LA INFORMACIÓN AQUÍ SUMINISTRADA HA SIDO CONSTATADA FRENTE A LOS DOCUMENTOS QUE HAN SIDO PRESENTADOS COMO SOPORTE.
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', fontSize: '7.5pt', marginTop: '20px' }}>
            <div style={{ width: '42%', textAlign: 'center' }}>
              <input
                type="text"
                className="live-doc-input live-doc-input-center live-doc-underline"
                style={{ fontWeight: 'bold', fontSize: '8pt' }}
                value={hrObservations.dateAndCity}
                onChange={(e) => updateData((prev) => ({ ...prev, hrObservations: { ...prev.hrObservations, dateAndCity: e.target.value.toUpperCase() } }))}
              />
              <div style={{ fontSize: '7pt', fontWeight: 'bold', paddingTop: '2px' }}>
                CIUDAD Y FECHA
              </div>
            </div>

            <div style={{ width: '52%', textAlign: 'center' }}>
              <input
                type="text"
                className="live-doc-input live-doc-input-center live-doc-underline"
                style={{ fontWeight: 'bold', fontSize: '8pt' }}
                value={hrObservations.hrHeadNameAndSignature}
                onChange={(e) => updateData((prev) => ({ ...prev, hrObservations: { ...prev.hrObservations, hrHeadNameAndSignature: e.target.value.toUpperCase() } }))}
              />
              <div style={{ fontSize: '7pt', fontWeight: 'bold', paddingTop: '2px' }}>
                NOMBRE Y FIRMA DEL JEFE DE PERSONAL O DE CONTRATOS
              </div>
            </div>
          </div>
        </div>

        {/* Page Footer 3 */}
        <div className="doc-footer-page">
          <div className="doc-footer-info">
            LÍNEA GRATUITA DE ATENCIÓN AL CLIENTE No. 018000917770 PÁGINA WEB: www.funcionpublica.gov.co
          </div>
          <div style={{ fontSize: '10pt', fontWeight: 'bold' }}>{expPages.length + 2}</div>
        </div>
      </div>

      {/* ==================== SIGNATURE MODAL POPOVER ==================== */}
      {showSignatureModal && (
        <div className="sig-modal-overlay no-print" onClick={(e) => e.target === e.currentTarget && setShowSignatureModal(false)}>
          <div className="sig-modal-card">
            <div className="sig-modal-header">
              <h3 className="sig-modal-title">
                <PenTool size={18} /> Firmar Documento
              </h3>
              <button
                type="button"
                onClick={() => setShowSignatureModal(false)}
                className="sig-modal-close"
                title="Cerrar modal"
              >
                ✕
              </button>
            </div>

            {/* Signature Method Tabs */}
            <div className="sig-tabs-bar">
              <button
                type="button"
                className={`sig-tab-btn ${signature.signatureType === 'TEXT' ? 'active' : ''}`}
                onClick={() => updateData((prev) => ({ ...prev, signature: { ...prev.signature, signatureType: 'TEXT' } }))}
              >
                <Type size={14} /> Texto
              </button>
              <button
                type="button"
                className={`sig-tab-btn ${signature.signatureType === 'DRAW' ? 'active' : ''}`}
                onClick={() => updateData((prev) => ({ ...prev, signature: { ...prev.signature, signatureType: 'DRAW' } }))}
              >
                <PenTool size={14} /> Dibujar
              </button>
              <button
                type="button"
                className={`sig-tab-btn ${signature.signatureType === 'IMAGE' ? 'active' : ''}`}
                onClick={() => updateData((prev) => ({ ...prev, signature: { ...prev.signature, signatureType: 'IMAGE' } }))}
              >
                <ImageIcon size={14} /> Cargar Imagen
              </button>
            </div>

            {signature.signatureType === 'TEXT' && (
              <div>
                <label style={{ fontSize: '0.75rem', fontWeight: 'bold', color: '#94a3b8', display: 'block', marginBottom: '0.25rem' }}>
                  Nombre / Texto de Firma:
                </label>
                <input
                  type="text"
                  className="sig-input-text"
                  placeholder="Escriba su nombre completo..."
                  value={signature.signatureData}
                  onChange={(e) => updateData((prev) => ({ ...prev, signature: { ...prev.signature, signatureData: e.target.value } }))}
                />
              </div>
            )}

            {signature.signatureType === 'DRAW' && (
              <div>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.25rem' }}>
                  <label style={{ fontSize: '0.75rem', fontWeight: 'bold', color: '#94a3b8' }}>
                    Trace su firma dentro del recuadro:
                  </label>
                  <button
                    type="button"
                    onClick={() => {
                      if (signatureCanvasRef) {
                        const ctx = signatureCanvasRef.getContext('2d');
                        ctx?.clearRect(0, 0, signatureCanvasRef.width, signatureCanvasRef.height);
                      }
                      updateData((prev) => ({ ...prev, signature: { ...prev.signature, signatureData: '' } }));
                    }}
                    style={{ fontSize: '0.75rem', color: '#38bdf8', background: 'transparent', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.25rem' }}
                  >
                    <RotateCcw size={12} /> Borrar trazo
                  </button>
                </div>
                <div className="sig-canvas-wrapper">
                  <canvas
                    ref={(el) => setSignatureCanvasRef(el)}
                    width={460}
                    height={160}
                    className="sig-canvas"
                    onMouseDown={startDrawing}
                    onMouseMove={draw}
                    onMouseUp={stopDrawing}
                    onMouseLeave={stopDrawing}
                    onTouchStart={startDrawing}
                    onTouchMove={draw}
                    onTouchEnd={stopDrawing}
                  />
                </div>
              </div>
            )}

            {signature.signatureType === 'IMAGE' && (
              <div>
                <label style={{ fontSize: '0.75rem', fontWeight: 'bold', color: '#94a3b8', display: 'block', marginBottom: '0.25rem' }}>
                  Seleccione archivo de imagen (PNG o JPG):
                </label>
                <input
                  type="file"
                  accept="image/*"
                  className="sig-file-input"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (!file) return;
                    const reader = new FileReader();
                    reader.onload = (ev) => {
                      const res = ev.target?.result;
                      if (res && typeof res === 'string') {
                        updateData((prev) => ({ ...prev, signature: { ...prev.signature, signatureData: res } }));
                      }
                    };
                    reader.readAsDataURL(file);
                  }}
                />
                {signature.signatureData && (
                  <div style={{ marginTop: '0.5rem', padding: '0.5rem', background: '#ffffff', borderRadius: '6px', textAlign: 'center' }}>
                    <img src={signature.signatureData} alt="Firma cargada" style={{ maxHeight: '80px', margin: '0 auto' }} />
                  </div>
                )}
              </div>
            )}

            <div style={{ display: 'flex', justifyContent: 'flex-end', paddingTop: '0.5rem', borderTop: '1px solid rgba(255, 255, 255, 0.1)' }}>
              <button
                type="button"
                onClick={() => setShowSignatureModal(false)}
                className="btn btn-primary"
              >
                <Check size={16} /> Guardar Firma
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
