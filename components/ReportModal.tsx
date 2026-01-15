
import React, { useState } from 'react';
import { Icons } from './Icons';

interface ReportModalProps {
  userName: string;
  onClose: () => void;
  onSubmit: (reason: string) => void;
}

export const ReportModal: React.FC<ReportModalProps> = ({ userName, onClose, onSubmit }) => {
  const [reason, setReason] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const reasons = [
    "Inappropriate content",
    "Spam or scam",
    "Harassment",
    "Fake profile",
    "Underage",
    "Other"
  ];

  const handleSubmit = async () => {
      if (!reason) return;
      setIsSubmitting(true);
      await onSubmit(reason);
      setIsSubmitting(false);
      onClose();
  };

  return (
    <div className="fixed inset-0 z-[80] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-[32px] w-full max-w-sm p-6 shadow-2xl animate-in zoom-in-95 border border-warm-gray">
        <div className="flex justify-between items-center mb-2">
          <h2 className="text-xl font-extrabold text-text-main tracking-tight">Report {userName}</h2>
          <button onClick={onClose} className="p-2 hover:bg-warm-gray rounded-full transition-colors -mr-2">
             <Icons.X size={20} className="text-text-sec" />
          </button>
        </div>

        <p className="text-sm text-text-sec mb-6 font-medium">
          We treat reports anonymously and seriously. Why are you reporting this user?
        </p>

        <div className="space-y-2 mb-8">
          {reasons.map((r) => (
            <button
              key={r}
              onClick={() => setReason(r)}
              className={`w-full p-4 rounded-2xl text-left text-sm font-bold transition-all flex justify-between items-center ${
                reason === r
                  ? 'bg-red-50 text-red-600 border-2 border-red-200 shadow-sm'
                  : 'bg-warm-white text-text-main border-2 border-transparent hover:border-warm-gray'
              }`}
            >
              {r}
              {reason === r && <Icons.Check size={16} className="text-red-600" />}
            </button>
          ))}
        </div>

        <button
          disabled={!reason || isSubmitting}
          onClick={handleSubmit}
          className="w-full py-4 bg-red-500 hover:bg-red-600 text-white font-bold rounded-2xl disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg shadow-red-500/20 active:scale-[0.98] flex items-center justify-center gap-2"
        >
          {isSubmitting ? (
              <>
                 <Icons.Loader2 size={20} className="animate-spin" /> Sending...
              </>
          ) : (
              "Submit Report"
          )}
        </button>
      </div>
    </div>
  );
};
