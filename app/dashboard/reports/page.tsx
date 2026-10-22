'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import DashboardLayout from '@/components/DashboardLayout';

type Report = {
  id: string;
  fileName: string;
  fileUrl: string;
  fileSize: number;
  category: string;
  createdAt: string;
};

const CATEGORIES = ['Blood Reports', 'Imaging', 'Prescriptions', 'Other'];

export default function ReportsPage() {
  const [reports, setReports] = useState<Report[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Other');
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const loadReports = useCallback(async () => {
    setLoading(true);
    setLoadError(false);
    try {
      const res = await fetch('/api/reports', { credentials: 'include' });
      if (!res.ok) throw new Error('failed');
      const data = await res.json();
      setReports(data.reports ?? []);
    } catch {
      setLoadError(true);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadReports();
  }, [loadReports]);

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    setUploading(true);
    setUploadError('');

    const formData = new FormData();
    formData.append('file', files[0]);
    formData.append('category', selectedCategory);

    try {
      const res = await fetch('/api/reports', { method: 'POST', body: formData, credentials: 'include' });
      const data = await res.json();
      if (res.ok && data.success) {
        setReports((prev) => [data.report, ...prev]);
      } else {
        setUploadError(data.message || 'Upload failed. Please try again.');
      }
    } catch {
      setUploadError('Network error. Please try again.');
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const handleDelete = async (id: string) => {
    const prev = reports;
    setReports((current) => current.filter((r) => r.id !== id));
    try {
      const res = await fetch(`/api/reports/${id}`, { method: 'DELETE', credentials: 'include' });
      if (!res.ok) throw new Error('failed');
    } catch {
      setReports(prev);
      alert('Could not delete this report. Please try again.');
    }
  };

  const handleShare = async (report: Report) => {
    try {
      await navigator.clipboard.writeText(report.fileUrl);
      setCopiedId(report.id);
      setTimeout(() => setCopiedId((current) => (current === report.id ? null : current)), 2000);
    } catch {
      alert('Could not copy the link. Long-press or right-click the Download link to copy it manually.');
    }
  };

  const formatSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / 1024 / 1024).toFixed(1)} MB`;
  };

  return (
    <DashboardLayout>
      <div className="p-6 lg:p-10 max-w-4xl">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900">My Medical Reports</h1>
          <p className="text-gray-500 mt-1">Upload and manage your medical documents securely.</p>
        </div>

        {/* Upload card */}
        <div className="bg-white border-2 border-dashed border-blue-300 rounded-2xl p-8 text-center mb-8 hover:border-blue-500 transition-colors">
          <div className="text-4xl mb-3">📤</div>
          <h2 className="font-bold text-gray-900 mb-1">Upload a Report</h2>
          <p className="text-gray-500 text-sm mb-4">PDF, JPG, PNG up to 20 MB. Stored encrypted on secure cloud.</p>

          <div className="flex flex-col sm:flex-row gap-3 justify-center items-center">
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="px-4 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-blue-400 bg-white"
            >
              {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
            </select>
            <label className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl cursor-pointer transition-colors text-sm">
              {uploading ? 'Uploading…' : 'Choose File'}
              <input
                ref={fileInputRef}
                type="file"
                accept=".pdf,.jpg,.jpeg,.png"
                onChange={handleUpload}
                disabled={uploading}
                className="hidden"
              />
            </label>
          </div>
          {uploadError && <p className="text-red-500 text-sm mt-3">{uploadError}</p>}
        </div>

        {loading && (
          <div className="space-y-2">
            {[0, 1, 2].map((i) => (
              <div key={i} className="h-[68px] bg-gray-100 rounded-xl animate-pulse" />
            ))}
          </div>
        )}

        {!loading && loadError && (
          <div className="text-center py-10 bg-red-50 border border-red-100 rounded-xl">
            <p className="text-red-600 font-medium mb-2">Couldn&apos;t load your reports.</p>
            <button onClick={loadReports} className="text-sm text-blue-600 hover:underline font-medium">
              Try again
            </button>
          </div>
        )}

        {!loading && !loadError && reports.length === 0 && (
          <div className="text-center py-12 text-gray-400">
            <p className="text-4xl mb-3">🗂️</p>
            <p>No reports uploaded yet. Upload your first report above.</p>
          </div>
        )}

        {!loading && !loadError && reports.length > 0 && CATEGORIES.map((cat) => {
          const catReports = reports.filter((r) => r.category === cat);
          if (catReports.length === 0) return null;
          return (
            <div key={cat} className="mb-6">
              <h2 className="font-bold text-gray-900 mb-3">{cat}</h2>
              <div className="space-y-2">
                {catReports.map((report) => (
                  <div key={report.id} className="flex items-center gap-4 bg-white border border-gray-100 rounded-xl p-4">
                    <span className="text-2xl flex-shrink-0">📄</span>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-gray-900 truncate">{report.fileName}</p>
                      <p className="text-xs text-gray-400">{formatSize(report.fileSize)} · {new Date(report.createdAt).toLocaleDateString()}</p>
                    </div>
                    <div className="flex gap-3 flex-shrink-0">
                      <a href={report.fileUrl} target="_blank" rel="noopener noreferrer" className="text-xs text-blue-600 hover:underline font-medium">View</a>
                      <a href={report.fileUrl} download={report.fileName} className="text-xs text-blue-600 hover:underline font-medium">Download</a>
                      <button onClick={() => handleShare(report)} className="text-xs text-green-600 hover:underline font-medium">
                        {copiedId === report.id ? 'Copied!' : 'Share'}
                      </button>
                      <button onClick={() => handleDelete(report.id)} className="text-xs text-red-500 hover:underline font-medium">Delete</button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </DashboardLayout>
  );
}
