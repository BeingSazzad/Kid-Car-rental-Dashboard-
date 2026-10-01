import { useState, useMemo } from 'react';
import {
  Search, FileText, CheckCircle2, AlertCircle, AlertTriangle,
  ExternalLink, X, Car, Phone, Mail, Check, Download, ShieldCheck
} from 'lucide-react';

interface KYCDoc {
  id: string;
  name: string;
  issuerAndDetails: string;
  validUntil: string;
  status: 'Verified' | 'Missing' | 'Expired';
}

interface KYCCandidate {
  id: string;
  name: string;
  role: 'Driver' | 'Walker';
  email: string;
  phone: string;
  submitted: string;
  status: 'Approved' | 'Ready for review' | 'Missing document' | 'Expired document';
  initials: string;
  vehicleOrZone: string;
  warningNote?: string;
  documents: KYCDoc[];
}

const CANDIDATES: KYCCandidate[] = [
  {
    id: 'KYC-001',
    name: 'Alex Rivera',
    role: 'Driver',
    email: 'alex.rivera@email.com',
    phone: '+1 (555) 234-8901',
    submitted: 'Submitted 2 days ago',
    status: 'Missing document',
    initials: 'AR',
    vehicleOrZone: 'Toyota Sienna 2022 • 7 seats • BCD-8921',
    warningNote: 'Vulnerable Sector Check is required before approval.',
    documents: [
      { id: 'd1', name: 'Commercial driving license', issuerAndDetails: 'ICBC • Class 4 unrestricted', validUntil: 'Oct 14, 2028', status: 'Verified' },
      { id: 'd2', name: 'Vehicle commercial insurance', issuerAndDetails: 'Aviva Canada • Special transit policy', validUntil: 'Aug 20, 2027', status: 'Verified' },
      { id: 'd3', name: 'Vulnerable Sector Check', issuerAndDetails: 'Awaiting upload', validUntil: '—', status: 'Missing' },
    ],
  },
  {
    id: 'KYC-002',
    name: 'Nadia Rahman',
    role: 'Walker',
    email: 'nadia.r@email.com',
    phone: '+1 (555) 456-7890',
    submitted: 'Submitted 3 hours ago',
    status: 'Ready for review',
    initials: 'NR',
    vehicleOrZone: 'Greenfield Elementary Walking Zone',
    documents: [
      { id: 'd4', name: 'Government Photo ID', issuerAndDetails: 'Ontario Photo Card • Verified', validUntil: 'Mar 15, 2029', status: 'Verified' },
      { id: 'd5', name: 'Police Vulnerable Sector Check', issuerAndDetails: 'Toronto Police Service • Record Clear', validUntil: 'Jan 10, 2028', status: 'Verified' },
      { id: 'd6', name: 'Emergency First Aid & CPR', issuerAndDetails: 'Canadian Red Cross • Standard First Aid', validUntil: 'Nov 05, 2027', status: 'Verified' },
    ],
  },
  {
    id: 'KYC-003',
    name: 'Marcus Chen',
    role: 'Driver',
    email: 'marcus.c@email.com',
    phone: '+1 (555) 789-0123',
    submitted: 'Submitted 5 days ago',
    status: 'Expired document',
    initials: 'MC',
    vehicleOrZone: 'Honda Odyssey 2021 • 8 seats • KLM-4432',
    warningNote: 'Commercial insurance expired on Aug 30, 2026. Needs renewal.',
    documents: [
      { id: 'd7', name: 'Commercial driving license', issuerAndDetails: 'Ontario Driver Licence Class G • Clean', validUntil: 'May 22, 2027', status: 'Verified' },
      { id: 'd8', name: 'Vehicle commercial insurance', issuerAndDetails: 'Intact Insurance • Expired Aug 2026', validUntil: 'Aug 30, 2026', status: 'Expired' },
      { id: 'd9', name: 'Police Vulnerable Sector Check', issuerAndDetails: 'OPP Background Unit • Clear', validUntil: 'Nov 12, 2027', status: 'Verified' },
    ],
  },
  {
    id: 'KYC-004',
    name: 'Elena Popescu',
    role: 'Walker',
    email: 'elena.p@email.com',
    phone: '+1 (555) 901-2345',
    submitted: 'Submitted 1 day ago',
    status: 'Ready for review',
    initials: 'EP',
    vehicleOrZone: 'Downtown & Rosedale Walk Route',
    documents: [
      { id: 'd10', name: 'Government Photo ID', issuerAndDetails: 'BC Services Card Photo ID', validUntil: 'Jun 18, 2029', status: 'Verified' },
      { id: 'd11', name: 'Police Vulnerable Sector Check', issuerAndDetails: 'Vancouver Police Dept • Clear', validUntil: 'Sep 25, 2027', status: 'Verified' },
      { id: 'd12', name: 'Standard Child Safety Training', issuerAndDetails: 'St. John Ambulance Certified', validUntil: 'Feb 14, 2027', status: 'Verified' },
    ],
  },
];

export default function KYCPage() {
  const [candidates, setCandidates] = useState<KYCCandidate[]>(CANDIDATES);
  const [selectedId, setSelectedId] = useState<string>('KYC-001');
  const [search, setSearch] = useState('');
    const [inspectDoc, setInspectDoc] = useState<KYCDoc | null>(null);
  const [actionNotice, setActionNotice] = useState<string | null>(null);

  // Filter candidates list
  const filteredCandidates = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return candidates;
    return candidates.filter(c =>
      c.name.toLowerCase().includes(q) ||
      c.id.toLowerCase().includes(q) ||
      c.role.toLowerCase().includes(q)
    );
  }, [candidates, search]);

  const activeCandidate = candidates.find(c => c.id === selectedId) || candidates[0];

      // Handle Approve action (1-word button)
  const handleApprove = () => {
    if (!activeCandidate) return;
    setCandidates(prev => prev.map(c => c.id === activeCandidate.id ? { ...c, status: 'Approved' } : c));
    setActionNotice(`${activeCandidate.name} approved successfully.`);
    setTimeout(() => setActionNotice(null), 2400);
  };

  // Handle Reject action (1-word button)
  const handleReject = () => {
    if (!activeCandidate) return;
    setCandidates(prev => prev.filter(c => c.id !== activeCandidate.id));
    setActionNotice(`${activeCandidate.name} application rejected.`);
    setTimeout(() => setActionNotice(null), 2400);
  };

  // Handle Request Doc action (concise button)
  const handleRequestDoc = (docName?: string) => {
    if (!activeCandidate) return;
    const targetDoc = docName ? `"${docName}"` : 'required documents';
    setActionNotice(`Update request sent to ${activeCandidate.name} for ${targetDoc}.`);
    setTimeout(() => setActionNotice(null), 2400);
  };

  // Handle Verify Single Document inside inspector
  const handleVerifyDocument = (docId: string) => {
    if (!activeCandidate) return;
    const updatedDocs = activeCandidate.documents.map(d => d.id === docId ? { ...d, status: 'Verified' as const } : d);
    const allVerified = updatedDocs.every(d => d.status === 'Verified');
    
    setCandidates(prev => prev.map(c => {
      if (c.id === activeCandidate.id) {
        return {
          ...c,
          documents: updatedDocs,
          status: allVerified ? 'Ready for review' : c.status,
          warningNote: allVerified ? undefined : c.warningNote,
        };
      }
      return c;
    }));

    if (inspectDoc && inspectDoc.id === docId) {
      setInspectDoc(prev => prev ? { ...prev, status: 'Verified' } : null);
    }

    setActionNotice('Document marked as Verified.');
    setTimeout(() => setActionNotice(null), 2400);
  };

  // Handle Download Document File (Real client-side file download)
  const handleDownloadDoc = (doc: KYCDoc) => {
    if (!activeCandidate) return;
    const textContent = `================================================
HOME2SCHOOL KYC VERIFICATION DOCUMENT
================================================
Document Name:      ${doc.name}
Candidate:          ${activeCandidate.name} (${activeCandidate.id})
Candidate Role:     ${activeCandidate.role}
Issuing Authority:  ${doc.issuerAndDetails}
Valid Until:        ${doc.validUntil}
Verification State: ${doc.status}
------------------------------------------------
Security Hash: SHA256-H2S-${doc.id}-SECURED
Audit Status: Verified by SafeRide Admin Engine
================================================`;

    const blob = new Blob([textContent], { type: 'text/plain;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `KYC_${activeCandidate.name.replace(/\s+/g, '_')}_${doc.id}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    setActionNotice(`Downloaded ${doc.name}.`);
    setTimeout(() => setActionNotice(null), 2400);
  };

  const verifiedDocsCount = activeCandidate ? activeCandidate.documents.filter(d => d.status === 'Verified').length : 0;
  const totalDocsCount = activeCandidate ? activeCandidate.documents.length : 0;
  const isAllVerified = verifiedDocsCount === totalDocsCount && totalDocsCount > 0;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20, fontFamily: 'Manrope, sans-serif' }}>
      {/* Header */}
      <div>
        <h1 style={{ fontSize: 24, fontWeight: 800, color: '#1A1D24', margin: 0, letterSpacing: '-0.02em' }}>
          Identity & KYC verification
        </h1>
        <p style={{ fontSize: 14, fontWeight: 500, color: '#64748B', margin: '4px 0 0' }}>
          Review provider details, verify credentials, and manage onboarding compliance.
        </p>
      </div>

      {actionNotice && (
        <div style={{
          padding: '10px 16px',
          background: '#ECFDF5',
          border: '1px solid #A7F3D0',
          borderRadius: 8,
          color: '#065F46',
          fontSize: 14,
          fontWeight: 700,
          display: 'flex',
          alignItems: 'center',
          gap: 8,
        }}>
          <Check size={16} />
          {actionNotice}
        </div>
      )}

      {/* Main Grid: Left Candidate Queue (340px) + Right Document Inspector */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: 20, alignItems: 'start' }}>
        
        {/* LEFT: Candidate List Card */}
        <div style={{ background: '#FFFFFF', border: '1px solid #E2E8F0', borderRadius: 14, padding: 16, display: 'flex', flexDirection: 'column', gap: 14 }}>
          {/* Search Box */}
          <div style={{ position: 'relative' }}>
            <Search size={14} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: '#94A3B8' }} />
            <input
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search candidates"
              style={{
                width: '100%',
                height: 38,
                paddingLeft: 34,
                paddingRight: 12,
                borderRadius: 8,
                border: '1px solid #E2E8F0',
                fontSize: 14,
                fontFamily: 'Manrope, sans-serif',
                fontWeight: 500,
                color: '#1A1D24',
                background: '#F8FAFC',
                outline: 'none',
                boxSizing: 'border-box',
              }}
            />
          </div>

          {/* Candidates List Container */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8, maxHeight: 520, overflowY: 'auto' }}>
            {filteredCandidates.length === 0 ? (
              <div style={{ padding: 24, textAlign: 'center', color: '#94A3B8', fontSize: 12 }}>
                No candidates found.
              </div>
            ) : (
              filteredCandidates.map(c => {
                const isSelected = c.id === activeCandidate?.id;
                const isApproved = c.status === 'Approved';
                const isReady = c.status === 'Ready for review';
                const isMissing = c.status === 'Missing document';

                const statusBg = isApproved ? '#ECFDF5' : isReady ? '#EEF2FF' : isMissing ? '#FEF2F2' : '#FFFBEB';
                const statusColor = isApproved ? '#059669' : isReady ? '#4F46E5' : isMissing ? '#DC2626' : '#D97706';

                return (
                  <div
                    key={c.id}
                    onClick={() => setSelectedId(c.id)}
                    style={{
                      padding: 12,
                      borderRadius: 10,
                      cursor: 'pointer',
                      border: isSelected ? '1.5px solid #1B2B68' : '1px solid #E2E8F0',
                      borderLeft: isSelected ? '4px solid #1B2B68' : '1px solid #E2E8F0',
                      background: isSelected ? '#F0F4FA' : '#FFFFFF',
                      display: 'flex',
                      alignItems: 'center',
                      gap: 12,
                      transition: 'all 0.15s ease',
                    }}
                  >
                    {/* Avatar */}
                    <div
                      style={{
                        width: 38,
                        height: 38,
                        borderRadius: '50%',
                        background: '#EEF2F9',
                        color: '#1B2B68',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: 14,
                        fontWeight: 800,
                        flexShrink: 0,
                      }}
                    >
                      {c.initials}
                    </div>

                    {/* Details */}
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 6, marginBottom: 3 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                          <span style={{ fontSize: 14, fontWeight: 700, color: '#1A1D24' }}>
                            {c.name}
                          </span>
                          <span style={{
                            fontSize: 10,
                            fontWeight: 700,
                            padding: '2px 6px',
                            borderRadius: 4,
                            background: c.role === 'Driver' ? '#EEF1FB' : '#D1FAE5',
                            color: c.role === 'Driver' ? '#1B2B68' : '#065F46',
                          }}>
                            {c.role}
                          </span>
                        </div>

                        {/* Status Badge */}
                        <span style={{
                          fontSize: 10,
                          fontWeight: 700,
                          padding: '2px 8px',
                          borderRadius: 99,
                          background: statusBg,
                          color: statusColor,
                          whiteSpace: 'nowrap',
                          flexShrink: 0,
                        }}>
                          • {c.status}
                        </span>
                      </div>

                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: 12, color: '#94A3B8' }}>
                        <span>{c.id}</span>
                        <span>{c.submitted}</span>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* RIGHT: Document Inspector Detail */}
        {activeCandidate ? (
          <div style={{ background: '#FFFFFF', border: '1px solid #E2E8F0', borderRadius: 14, padding: 20, display: 'flex', flexDirection: 'column', gap: 18 }}>
            
            {/* Candidate Summary Header */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              paddingBottom: 16,
              borderBottom: '1px solid #F1F5F9',
              flexWrap: 'wrap',
              gap: 12,
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                <div style={{
                  width: 44,
                  height: 44,
                  borderRadius: '50%',
                  background: '#EEF2F9',
                  color: '#1B2B68',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: 16,
                  fontWeight: 800,
                  flexShrink: 0,
                }}>
                  {activeCandidate.initials}
                </div>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <span style={{ fontSize: 18, fontWeight: 800, color: '#1A1D24' }}>
                      {activeCandidate.name}
                    </span>
                    <span style={{
                      fontSize: 10,
                      fontWeight: 700,
                      padding: '2px 7px',
                      borderRadius: 4,
                      background: activeCandidate.role === 'Driver' ? '#EEF1FB' : '#D1FAE5',
                      color: activeCandidate.role === 'Driver' ? '#1B2B68' : '#065F46',
                    }}>
                      {activeCandidate.role}
                    </span>
                    <span style={{ fontSize: 12, fontWeight: 600, color: '#94A3B8', background: '#F8FAFC', padding: '2px 6px', borderRadius: 4, border: '1px solid #E2E8F0' }}>
                      {activeCandidate.id}
                    </span>
                    {activeCandidate.status === 'Approved' && (
                      <span style={{ fontSize: 10, fontWeight: 700, padding: '2px 8px', borderRadius: 99, background: '#ECFDF5', color: '#059669', display: 'flex', alignItems: 'center', gap: 4 }}>
                        <ShieldCheck size={12} /> Approved
                      </span>
                    )}
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginTop: 4, fontSize: 12, color: '#64748B' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                      <Mail size={12} style={{ color: '#94A3B8' }} />
                      <span>{activeCandidate.email}</span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                      <Phone size={12} style={{ color: '#94A3B8' }} />
                      <span>{activeCandidate.phone}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Vehicle / Zone Tag */}
              <div style={{
                background: '#F8FAFC',
                border: '1px solid #E2E8F0',
                borderRadius: 8,
                padding: '8px 12px',
                fontSize: 12,
                fontWeight: 600,
                color: '#475569',
                display: 'flex',
                alignItems: 'center',
                gap: 6,
              }}>
                <Car size={14} style={{ color: '#1B2B68' }} />
                <span>{activeCandidate.vehicleOrZone}</span>
              </div>
            </div>

            {/* Verification Documents Header */}
            <div>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
                <h2 style={{ fontSize: 16, fontWeight: 800, color: '#1A1D24', margin: 0 }}>
                  Verification documents
                </h2>
                <span style={{ fontSize: 12, fontWeight: 700, color: '#64748B' }}>
                  {verifiedDocsCount} of {totalDocsCount} verified
                </span>
              </div>

              {/* Documents Table / Card Container */}
              <div style={{ border: '1px solid #E2E8F0', borderRadius: 10, overflow: 'hidden' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                  <thead>
                    <tr style={{ background: '#F8FAFC', borderBottom: '1px solid #E2E8F0' }}>
                      <th style={{ padding: '10px 14px', fontSize: 12, fontWeight: 700, color: '#64748B', width: '40%' }}>Document</th>
                      <th style={{ padding: '10px 14px', fontSize: 12, fontWeight: 700, color: '#64748B', width: '22%' }}>Valid until</th>
                      <th style={{ padding: '10px 14px', fontSize: 12, fontWeight: 700, color: '#64748B', width: '18%' }}>Status</th>
                      <th style={{ padding: '10px 14px', fontSize: 12, fontWeight: 700, color: '#64748B', textAlign: 'right', width: '20%' }}>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {activeCandidate.documents.map((doc, idx) => {
                      const isVer = doc.status === 'Verified';
                      const isMiss = doc.status === 'Missing';
                      const statColor = isVer ? '#059669' : isMiss ? '#DC2626' : '#D97706';

                      return (
                        <tr key={doc.id} style={{ borderBottom: idx < activeCandidate.documents.length - 1 ? '1px solid #F1F5F9' : 'none' }}>
                          {/* Document Info */}
                          <td style={{ padding: '12px 14px' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                              <div style={{ width: 32, height: 32, borderRadius: 6, background: '#F8FAFC', border: '1px solid #E2E8F0', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#1B2B68', flexShrink: 0 }}>
                                <FileText size={16} />
                              </div>
                              <div>
                                <p style={{ fontSize: 14, fontWeight: 700, color: '#1A1D24', margin: 0 }}>
                                  {doc.name}
                                </p>
                                <p style={{ fontSize: 12, fontWeight: 500, color: '#94A3B8', margin: '2px 0 0' }}>
                                  {doc.issuerAndDetails}
                                </p>
                              </div>
                            </div>
                          </td>

                          {/* Valid Until */}
                          <td style={{ padding: '12px 14px', fontSize: 12, fontWeight: 600, color: '#475569' }}>
                            {doc.validUntil}
                          </td>

                          {/* Status */}
                          <td style={{ padding: '12px 14px' }}>
                            <span style={{ fontSize: 12, fontWeight: 700, color: statColor }}>
                              • {doc.status}
                            </span>
                          </td>

                          {/* Action (Concise 1-word) */}
                          <td style={{ padding: '12px 14px', textAlign: 'right' }}>
                            {doc.status !== 'Missing' ? (
                              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: 8 }}>
                                <button
                                  type="button"
                                  onClick={() => handleDownloadDoc(doc)}
                                  title="Download Document"
                                  style={{
                                    background: 'none',
                                    border: 'none',
                                    color: '#64748B',
                                    cursor: 'pointer',
                                    padding: '4px',
                                    borderRadius: 4,
                                    display: 'inline-flex',
                                    alignItems: 'center',
                                  }}
                                >
                                  <Download size={14} />
                                </button>
                                <button
                                  type="button"
                                  onClick={() => setInspectDoc(doc)}
                                  style={{
                                    background: 'none',
                                    border: 'none',
                                    color: '#1B2B68',
                                    fontSize: 12,
                                    fontWeight: 700,
                                    cursor: 'pointer',
                                    display: 'inline-flex',
                                    alignItems: 'center',
                                    gap: 4,
                                    padding: 0,
                                  }}
                                >
                                  <span>View</span>
                                  <ExternalLink size={12} />
                                </button>
                              </div>
                            ) : (
                              <button
                                type="button"
                                onClick={() => handleRequestDoc(doc.name)}
                                style={{
                                  background: 'none',
                                  border: 'none',
                                  color: '#1B2B68',
                                  fontSize: 12,
                                  fontWeight: 700,
                                  cursor: 'pointer',
                                  display: 'inline-flex',
                                  alignItems: 'center',
                                  gap: 4,
                                  padding: 0,
                                }}
                              >
                                Request
                              </button>
                            )}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Warning Note if any */}
            {activeCandidate.warningNote && activeCandidate.status !== 'Approved' && (
              <div style={{
                background: '#FFFBEB',
                border: '1px solid #FDE68A',
                borderRadius: 8,
                padding: '10px 14px',
                fontSize: 12,
                color: '#B45309',
                display: 'flex',
                alignItems: 'center',
                gap: 8,
              }}>
                <AlertTriangle size={14} style={{ flexShrink: 0 }} />
                <span>{activeCandidate.warningNote}</span>
              </div>
            )}

            {/* Bottom Actions Row: Concise 1-word buttons */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingTop: 8, flexWrap: 'wrap', gap: 10 }}>
              <div style={{ display: 'flex', gap: 8 }}>
                {activeCandidate.status !== 'Approved' && (
                  <button
                    type="button"
                    onClick={handleApprove}
                    disabled={!isAllVerified}
                    style={{
                      height: 38,
                      padding: '0 18px',
                      borderRadius: 8,
                      border: 'none',
                      background: isAllVerified ? '#10B981' : '#94A3B8',
                      color: '#FFFFFF',
                      fontSize: 14,
                      fontWeight: 700,
                      cursor: isAllVerified ? 'pointer' : 'not-allowed',
                      display: 'flex',
                      alignItems: 'center',
                      gap: 6,
                    }}
                  >
                    <CheckCircle2 size={16} />
                    <span>Approve</span>
                  </button>
                )}

                <button
                  type="button"
                  onClick={handleReject}
                  style={{
                    height: 38,
                    padding: '0 14px',
                    borderRadius: 8,
                    border: '1px solid #CBD5E1',
                    background: '#FFFFFF',
                    color: '#64748B',
                    fontSize: 14,
                    fontWeight: 700,
                    cursor: 'pointer',
                  }}
                >
                  Reject
                </button>
              </div>

              {activeCandidate.status !== 'Approved' && (
                <button
                  type="button"
                  onClick={() => handleRequestDoc()}
                  style={{
                    height: 38,
                    padding: '0 16px',
                    borderRadius: 8,
                    border: '1px solid #1B2B68',
                    background: '#FFFFFF',
                    color: '#1B2B68',
                    fontSize: 14,
                    fontWeight: 700,
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 6,
                  }}
                >
                  <AlertCircle size={14} />
                  <span>Request Doc</span>
                </button>
              )}
            </div>

          </div>
        ) : (
          <div style={{ background: '#FFFFFF', border: '1px solid #E2E8F0', borderRadius: 14, padding: 36, textAlign: 'center', color: '#94A3B8' }}>
            Select a candidate from the left queue to inspect verification records.
          </div>
        )}

      </div>

      {/* Document Inspector Modal */}
      {inspectDoc && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(15, 23, 42, 0.5)',
            backdropFilter: 'blur(3px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: 20,
            zIndex: 100,
          }}
          onClick={() => setInspectDoc(null)}
        >
          <div
            style={{
              width: '100%',
              maxWidth: 520,
              background: '#FFFFFF',
              borderRadius: 14,
              overflow: 'hidden',
              boxShadow: '0 20px 40px rgba(0,0,0,0.2)',
              fontFamily: 'Manrope, sans-serif',
            }}
            onClick={e => e.stopPropagation()}
          >
            <div style={{ padding: '16px 20px', borderBottom: '1px solid #F1F5F9', display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: '#FAFCFF' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <FileText size={16} style={{ color: '#1B2B68' }} />
                <span style={{ fontSize: 14, fontWeight: 800, color: '#1A1D24' }}>{inspectDoc.name}</span>
              </div>
              <button onClick={() => setInspectDoc(null)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#94A3B8' }}>
                <X size={16} />
              </button>
            </div>

            <div style={{ padding: 20, display: 'flex', flexDirection: 'column', gap: 14 }}>
              <div style={{ height: 180, background: '#F8FAFC', border: '1.5px dashed #CBD5E1', borderRadius: 8, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', color: '#64748B' }}>
                <FileText size={36} style={{ color: '#94A3B8', marginBottom: 8 }} />
                <p style={{ fontSize: 14, fontWeight: 700, margin: '0 0 2px', color: '#1A1D24' }}>{inspectDoc.name}</p>
                <p style={{ fontSize: 12, color: '#94A3B8', margin: 0 }}>{inspectDoc.issuerAndDetails}</p>
                <p style={{ fontSize: 10, color: inspectDoc.status === 'Verified' ? '#10B981' : '#D97706', fontWeight: 700, marginTop: 6 }}>
                  {inspectDoc.status === 'Verified' ? 'Official Government Digital Certificate Signed' : 'Pending Verification Review'}
                </p>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, background: '#F8FAFC', padding: 12, borderRadius: 8, fontSize: 12 }}>
                <div>
                  <span style={{ color: '#94A3B8', display: 'block' }}>Valid Until</span>
                  <strong style={{ color: '#1A1D24' }}>{inspectDoc.validUntil}</strong>
                </div>
                <div>
                  <span style={{ color: '#94A3B8', display: 'block' }}>Verification Status</span>
                  <strong style={{ color: inspectDoc.status === 'Verified' ? '#10B981' : inspectDoc.status === 'Missing' ? '#DC2626' : '#D97706' }}>
                    {inspectDoc.status}
                  </strong>
                </div>
              </div>
            </div>

            <div style={{ padding: '12px 20px', borderTop: '1px solid #F1F5F9', background: '#F8FAFC', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 10 }}>
              <button
                type="button"
                onClick={() => handleDownloadDoc(inspectDoc)}
                style={{
                  height: 36,
                  padding: '0 14px',
                  borderRadius: 6,
                  border: '1px solid #CBD5E1',
                  background: '#FFFFFF',
                  color: '#1B2B68',
                  fontSize: 12,
                  fontWeight: 700,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 6,
                }}
              >
                <Download size={14} />
                <span>Download</span>
              </button>

              <div style={{ display: 'flex', gap: 8 }}>
                {inspectDoc.status !== 'Verified' && (
                  <button
                    type="button"
                    onClick={() => handleVerifyDocument(inspectDoc.id)}
                    style={{
                      height: 36,
                      padding: '0 14px',
                      borderRadius: 6,
                      border: 'none',
                      background: '#10B981',
                      color: '#FFFFFF',
                      fontSize: 12,
                      fontWeight: 700,
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: 4,
                    }}
                  >
                    <Check size={14} />
                    <span>Verify</span>
                  </button>
                )}

                <button
                  type="button"
                  onClick={() => setInspectDoc(null)}
                  style={{
                    height: 36,
                    padding: '0 14px',
                    borderRadius: 6,
                    border: '1px solid #CBD5E1',
                    background: '#FFFFFF',
                    color: '#475569',
                    fontSize: 12,
                    fontWeight: 700,
                    cursor: 'pointer',
                  }}
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
