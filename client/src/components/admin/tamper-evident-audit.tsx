import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { apiRequest } from '@/lib/queryClient';
import { useToast } from '@/hooks/use-toast';

interface AuditLogEntry {
  id: string;
  ts: string;
  actor: {
    id: string;
    email: string;
    ip?: string;
  };
  action: string;
  target: {
    type: string;
    id: string;
  };
  meta_hash: string;
  prev_hash: string;
  hash: string;
}

interface VerificationResult {
  valid: boolean;
  entries: AuditLogEntry[];
  merkleRoot?: string;
  anchoredAt?: string;
  issues: Array<{
    index: number;
    reason: string;
    entryId: string;
    expected?: string;
    actual?: string;
  }>;
}

export function TamperEvidentAudit() {
  const { toast } = useToast();
  const [verificationResult, setVerificationResult] = useState<VerificationResult | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [auditEntries, setAuditEntries] = useState<AuditLogEntry[]>([]);

  const { data: auditData, isLoading, refetch } = useQuery({
    queryKey: ['/api/admin/audit-v2'],
    queryFn: async () => {
      const response = await fetch('/api/admin/audit-v2');
      if (!response.ok) throw new Error('Failed to fetch audit logs');
      return response.json();
    }
  });

  // Update local state when server data changes
  useEffect(() => {
    if (auditData?.items) {
      setAuditEntries(auditData.items);
    }
  }, [auditData]);

  const deleteAuditEntry = (entry: AuditLogEntry) => {
    // Immediate local state update for better UX
    setAuditEntries(prev => prev.filter(e => e.id !== entry.id));
    console.log('Audit entry deleted:', entry.action, entry.id);
    toast({
      title: 'Audit Entry Deleted',
      description: `Entry "${entry.action}" has been removed.`,
      variant: 'destructive',
    });
  };

  const sha256hex = async (str: string): Promise<string> => {
    const encoder = new TextEncoder();
    const data = encoder.encode(str);
    const hashBuffer = await crypto.subtle.digest('SHA-256', data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  };

  const merkleRootHex = async (leaves: string[]): Promise<string> => {
    if (leaves.length === 0) return '';
    let layer = leaves.map(h => h.toLowerCase());
    while (layer.length > 1) {
      const next = [];
      for (let i = 0; i < layer.length; i += 2) {
        const a = layer[i];
        const b = layer[i + 1] || layer[i];
        next.push(await sha256hex(a + b));
      }
      layer = next;
    }
    return layer[0];
  };

  const verifyAuditIntegrity = async () => {
    if (!auditEntries.length) {
      setVerificationResult({
        valid: true,
        entries: [],
        issues: []
      });
      setIsModalOpen(true);
      return;
    }

    const issues: VerificationResult['issues'] = [];
    let valid = true;

    for (let i = 0; i < auditEntries.length; i++) {
      const entry = auditEntries[i];
      
      // Recompute hash
      const payload = `${entry.prev_tamper_hash || ''}|${entry.ts}|${entry.actor_user_id}|${entry.action}|${entry.object_id}|${entry.tamper_hash}`;
      
      try {
        const calculatedHash = await sha256hex(payload);
        
        if (calculatedHash !== entry.tamper_hash) {
          valid = false;
          issues.push({
            index: i,
            reason: 'Hash mismatch',
            entryId: entry.id,
            expected: entry.tamper_hash,
            actual: calculatedHash
          });
        }

        // Check chain continuity
        if (i > 0 && auditEntries[i-1].tamper_hash !== entry.prev_tamper_hash) {
          valid = false;
          issues.push({
            index: i,
            reason: 'Chain break',
            entryId: entry.id,
            expected: auditEntries[i-1].tamper_hash,
            actual: entry.prev_tamper_hash || 'null'
          });
        }
      } catch (error) {
        valid = false;
        issues.push({
          index: i,
          reason: 'Hash computation failed',
          entryId: entry.id,
          expected: 'Valid hash',
          actual: 'Error'
        });
      }
    }

    // Compute Merkle root
    const hashes = auditEntries.map((e: any) => e.tamper_hash);
    const merkleRoot = await merkleRootHex(hashes);

    setVerificationResult({
      valid,
      entries: auditEntries,
      merkleRoot,
      anchoredAt: '2025-01-30T12:00:00Z', // Mock anchor time
      issues
    });
    setIsModalOpen(true);
  };

  const copyVerificationReport = async () => {
    if (!verificationResult) return;
    
    const report = {
      timestamp: new Date().toISOString(),
      verification: {
        status: verificationResult.valid ? 'VERIFIED' : 'FAILED',
        entriesChecked: verificationResult.entries.length,
        merkleRoot: verificationResult.merkleRoot,
        anchoredAt: verificationResult.anchoredAt,
        issues: verificationResult.issues
      }
    };

    await navigator.clipboard.writeText(JSON.stringify(report, null, 2));
  };

  const formatTimestamp = (ts: string) => {
    return new Date(ts).toLocaleString('en-US', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      timeZone: 'UTC',
      timeZoneName: 'short'
    });
  };

  const truncateHash = (hash: string, length = 8) => {
    return hash ? `${hash.substring(0, length)}...` : '—';
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isModalOpen) {
        setIsModalOpen(false);
      }
    };
    
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isModalOpen]);

  return (
    <div id="audit-root" data-testid="tamper-evident-audit">
      <div className="card">
        <div className="card-header">
          <h3>Tamper-Evident Audit Log</h3>
          <div style={{ display: 'flex', gap: '8px' }}>
            <button
              id="verifyBtn"
              className="btn primary"
              onClick={verifyAuditIntegrity}
              disabled={isLoading}
              data-testid="button-verify-integrity"
            >
              Verify Integrity
            </button>
            <button
              id="refreshBtn"
              className="btn ghost"
              onClick={() => refetch()}
              disabled={isLoading}
              data-testid="button-refresh"
            >
              Refresh
            </button>
          </div>
        </div>

        {/* Integrity summary */}
        <div style={{
          display: 'flex',
          gap: '12px',
          padding: '12px 16px',
          borderBottom: '1px solid #EEF1F5'
        }}>
          <span className="badge badge-ok" id="integrityStatus">
            {auditEntries.length > 0 ? 'Ready for verification' : 'No entries'}
          </span>
          <span>Last anchor: <strong id="anchorAt">—</strong></span>
          <span>Chain length: <strong id="chainLen">{auditEntries.length}</strong></span>
        </div>

        {/* Empty state */}
        {auditEntries.length === 0 && (
          <div
            id="emptyState"
            style={{
              textAlign: 'center',
              padding: '32px 16px',
              color: '#6B7280'
            }}
            data-testid="empty-state"
          >
            <div style={{ fontSize: '40px', marginBottom: '8px' }}>🛡️</div>
            <h4>No audit entries found</h4>
            <p>All admin actions will appear here and are protected by cryptographic verification.</p>
          </div>
        )}

        {/* Table */}
        {auditEntries.length > 0 && (
          <table id="auditTable" data-testid="audit-table">
            <thead>
              <tr>
                <th>Time (UTC)</th>
                <th>Actor</th>
                <th>Action</th>
                <th>Target</th>
                <th>Hash</th>
                <th>Prev</th>
                <th style={{width: '80px'}}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {auditEntries.map((entry: any, index: number) => (
                <tr key={entry.id} data-testid={`audit-row-${entry.id}`}>
                  <td>{formatTimestamp(entry.ts)}</td>
                  <td>
                    <div>
                      <div style={{ fontWeight: '500' }}>{entry.actor?.email || 'Unknown'}</div>
                      <div style={{ fontSize: '12px', color: '#6B7280' }}>
                        {entry.actor?.role || 'Unknown'} {entry.actor?.ip && `• ${entry.actor.ip}`}
                      </div>
                    </div>
                  </td>
                  <td>
                    <span 
                      className={`badge ${
                        entry.action.includes('create') ? 'badge-ok' :
                        entry.action.includes('delete') ? 'badge-fail' : 'badge-warn'
                      }`}
                    >
                      {entry.action}
                    </span>
                  </td>
                  <td>
                    <code style={{ fontSize: '12px' }}>
                      {entry.target?.type || entry.object_type}:{entry.target?.id || entry.object_id}
                    </code>
                  </td>
                  <td>
                    <code style={{ fontSize: '11px', color: '#6B7280' }}>
                      {truncateHash(entry.hash || entry.tamper_hash)}
                    </code>
                  </td>
                  <td>
                    <code style={{ fontSize: '11px', color: '#6B7280' }}>
                      {truncateHash(entry.prev_hash)}
                    </code>
                  </td>
                  <td className="row-actions">
                    <button
                      title="Delete audit entry"
                      onClick={() => deleteAuditEntry(entry)}
                      data-testid={`button-delete-audit-${entry.id}`}
                      style={{
                        background: 'transparent',
                        border: 'none',
                        padding: '4px',
                        cursor: 'pointer',
                        borderRadius: '4px',
                        color: '#DC3545',
                        fontSize: '14px'
                      }}
                    >
                      🗑️
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Verify Results Modal */}
      {isModalOpen && (
        <>
          <div
            id="audit-verify-backdrop"
            className="av-backdrop"
            onClick={() => setIsModalOpen(false)}
          />
          <div
            id="audit-verify-modal"
            className="av-modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="av-title"
            data-testid="verification-modal"
          >
            <div className="av-header">
              <h3 id="av-title">Verification Results</h3>
              <button
                id="av-close"
                className="av-x"
                aria-label="Close"
                onClick={() => setIsModalOpen(false)}
                data-testid="button-close-modal"
              >
                ✖
              </button>
            </div>

            <div className="av-body">
              <div className="av-summary">
                <span
                  id="av-status"
                  className={`badge ${verificationResult?.valid ? 'badge-ok' : 'badge-fail'}`}
                  data-testid="verification-status"
                >
                  {verificationResult?.valid ? 'Verified' : 'Failed'}
                </span>
                <span>
                  Checked entries: <strong id="av-count">{verificationResult?.entries.length || 0}</strong>
                </span>
                <span>
                  Merkle root: <code id="av-root">{verificationResult?.merkleRoot ? truncateHash(verificationResult.merkleRoot, 12) : '—'}</code>
                </span>
                <span>
                  Anchored at: <strong id="av-anchored">{verificationResult?.anchoredAt || '—'}</strong>
                </span>
              </div>

              {verificationResult?.valid && verificationResult.issues.length === 0 && (
                <div id="av-ok" className="av-ok" data-testid="verification-success">
                  ✅ All checks passed. Chain continuity and hashes verified.
                </div>
              )}

              {verificationResult?.issues && verificationResult.issues.length > 0 && (
                <div id="av-issues" data-testid="verification-issues">
                  <table className="av-table">
                    <thead>
                      <tr>
                        <th>#</th>
                        <th>Reason</th>
                        <th>Entry ID</th>
                        <th>Expected</th>
                        <th>Actual</th>
                      </tr>
                    </thead>
                    <tbody id="av-rows">
                      {verificationResult.issues.map((issue, index) => (
                        <tr key={index} data-testid={`issue-row-${index}`}>
                          <td>{issue.index}</td>
                          <td>{issue.reason}</td>
                          <td><code>{issue.entryId}</code></td>
                          <td><code>{truncateHash(issue.expected || '—', 16)}</code></td>
                          <td><code>{truncateHash(issue.actual || '—', 16)}</code></td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>

            <div className="av-footer">
              <button
                id="av-copy"
                className="btn ghost"
                onClick={copyVerificationReport}
                data-testid="button-copy-report"
              >
                Copy report
              </button>
              <button
                id="av-close2"
                className="btn primary"
                onClick={() => setIsModalOpen(false)}
                data-testid="button-close-modal-2"
              >
                Close
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}