"use client";

import React, { useState, useCallback } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/context/ToastContext';
import LoadingSpinner from '@/components/LoadingSpinner';
import { Pencil, Save, X, User, Mail, AtSign } from 'lucide-react';

interface ProfileFormData {
  firstName: string;
  lastName: string;
  displayName: string;
  email: string;
}

export default function ProfileContent() {
  const { user, isLoading, authFetch } = useAuth();
  const { showToast } = useToast();
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [formData, setFormData] = useState<ProfileFormData>({
    firstName: '',
    lastName: '',
    displayName: '',
    email: '',
  });

  const startEditing = useCallback(() => {
    if (!user) return;
    setFormData({
      firstName: user.firstName || '',
      lastName: user.lastName || '',
      displayName: user.displayName || '',
      email: user.email || '',
    });
    setIsEditing(true);
  }, [user]);

  const cancelEditing = useCallback(() => {
    setIsEditing(false);
  }, []);

  const handleSave = useCallback(async () => {
    if (!user) return;

    // Basic validation
    if (!formData.email.trim()) {
      showToast('ایمیل نمی‌تواند خالی باشد.', 'error');
      return;
    }

    setIsSaving(true);
    try {
      const response = await authFetch('/api/customer/update', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          firstName: formData.firstName,
          lastName: formData.lastName,
          displayName: formData.displayName,
          email: formData.email,
        }),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.error || 'خطا در بروزرسانی پروفایل.');
      }

      showToast('پروفایل با موفقیت بروزرسانی شد.', 'success');
      setIsEditing(false);

      // Refresh session to update client-side user data
      await fetch('/api/auth/session', { method: 'GET', credentials: 'include' });
      // Reload page to reflect cookie changes in AuthContext
      window.location.reload();
    } catch (error) {
      showToast(error instanceof Error ? error.message : 'خطای ناشناخته', 'error');
    } finally {
      setIsSaving(false);
    }
  }, [formData, user, authFetch, showToast]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-16">
        <LoadingSpinner />
      </div>
    );
  }

  // Avatar gradient based on first letter
  const avatarLetter = user?.displayName?.charAt(0) || user?.nicename?.charAt(0) || '?';
  // Use a deterministic gradient based on the letter
  const gradientIndex = avatarLetter.charCodeAt(0) % 6;
  const gradients = [
    'from-[var(--accent-hover)] to-[var(--accent)]',
    'from-emerald-500 to-teal-600',
    'from-amber-500 to-orange-600',
    'from-rose-500 to-pink-600',
    'from-violet-500 to-purple-600',
    'from-[var(--accent-hover)] to-[var(--accent)]',
  ];
  const avatarGradient = gradients[gradientIndex] || gradients[0];

  return (
    <section className="space-y-6">
      <h1 className="text-2xl sm:text-3xl font-extrabold text-[var(--text)]">پروفایل کاربری</h1>

      <div className="bg-[var(--surface-1)] rounded-xl shadow-lg max-w-2xl overflow-hidden">
          {/* Profile Header */}
          <div className="p-6 sm:p-8 border-b border-[var(--border)]">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                {/* Avatar circle */}
                <div className={`w-16 h-16 rounded-full bg-gradient-to-br ${avatarGradient} flex items-center justify-center text-[var(--text)] text-2xl font-bold shadow-lg flex-shrink-0`}>
                  {avatarLetter}
                </div>
                <div>
                  <h2 className="text-xl sm:text-2xl font-extrabold text-[var(--accent-hover)]">
                    {user?.displayName || 'کاربر'}
                  </h2>
                  <p className="text-[var(--text-muted)] text-sm mt-0.5">{user?.email}</p>
                </div>
              </div>

              {!isEditing && (
                <button
                  onClick={startEditing}
                  className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-[var(--accent)] hover:text-[var(--accent-hover)] bg-[var(--accent-hover)]/10 hover:bg-[var(--accent-hover)]/20 rounded-lg transition-colors duration-200"
                  aria-label="ویرایش پروفایل"
                >
                  <Pencil className="w-4 h-4" />
                  ویرایش
                </button>
              )}
            </div>
          </div>

          {/* Profile Content */}
          <div className="p-6 sm:p-8">
            {!isEditing ? (
              /* Display Mode */
              <dl className="space-y-6">
                <div className="flex items-start gap-3">
                  <User className="w-5 h-5 text-[var(--text-faint)] mt-0.5 flex-shrink-0" />
                  <div>
                    <dt className="text-sm font-medium text-[var(--text-muted)]">نام نمایشی</dt>
                    <dd className="mt-0.5 text-lg text-[var(--text)]">{user?.displayName || '-'}</dd>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Mail className="w-5 h-5 text-[var(--text-faint)] mt-0.5 flex-shrink-0" />
                  <div>
                    <dt className="text-sm font-medium text-[var(--text-muted)]">آدرس ایمیل</dt>
                    <dd className="mt-0.5 text-lg text-[var(--text)]" dir="ltr">{user?.email || '-'}</dd>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <AtSign className="w-5 h-5 text-[var(--text-faint)] mt-0.5 flex-shrink-0" />
                  <div>
                    <dt className="text-sm font-medium text-[var(--text-muted)]">نام کاربری</dt>
                    <dd className="mt-0.5 text-lg text-[var(--text)]">{user?.nicename || '-'}</dd>
                  </div>
                </div>
              </dl>
            ) : (
              /* Edit Mode */
              <div className="space-y-5">
                {/* Display Name */}
                <div>
                  <label htmlFor="displayName" className="block text-sm font-medium text-[var(--text-muted)] mb-1.5">
                    نام نمایشی
                  </label>
                  <input
                    id="displayName"
                    type="text"
                    value={formData.displayName}
                    onChange={(e) => setFormData(prev => ({ ...prev, displayName: e.target.value }))}
                    className="w-full px-4 py-2.5 bg-[var(--surface-2)] border border-[var(--border)] rounded-lg text-[var(--text)] placeholder-[var(--text-faint)] focus:outline-none focus:ring-2 focus:ring-[var(--accent)]/50 focus:border-[var(--accent)] transition-colors"
                    placeholder="نام نمایشی خود را وارد کنید"
                    disabled={isSaving}
                  />
                </div>

                {/* First Name */}
                <div>
                  <label htmlFor="firstName" className="block text-sm font-medium text-[var(--text-muted)] mb-1.5">
                    نام
                  </label>
                  <input
                    id="firstName"
                    type="text"
                    value={formData.firstName}
                    onChange={(e) => setFormData(prev => ({ ...prev, firstName: e.target.value }))}
                    className="w-full px-4 py-2.5 bg-[var(--surface-2)] border border-[var(--border)] rounded-lg text-[var(--text)] placeholder-[var(--text-faint)] focus:outline-none focus:ring-2 focus:ring-[var(--accent)]/50 focus:border-[var(--accent)] transition-colors"
                    placeholder="نام خود را وارد کنید"
                    disabled={isSaving}
                  />
                </div>

                {/* Last Name */}
                <div>
                  <label htmlFor="lastName" className="block text-sm font-medium text-[var(--text-muted)] mb-1.5">
                    نام خانوادگی
                  </label>
                  <input
                    id="lastName"
                    type="text"
                    value={formData.lastName}
                    onChange={(e) => setFormData(prev => ({ ...prev, lastName: e.target.value }))}
                    className="w-full px-4 py-2.5 bg-[var(--surface-2)] border border-[var(--border)] rounded-lg text-[var(--text)] placeholder-[var(--text-faint)] focus:outline-none focus:ring-2 focus:ring-[var(--accent)]/50 focus:border-[var(--accent)] transition-colors"
                    placeholder="نام خانوادگی خود را وارد کنید"
                    disabled={isSaving}
                  />
                </div>

                {/* Email */}
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-[var(--text-muted)] mb-1.5">
                    ایمیل
                  </label>
                  <input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                    className="w-full px-4 py-2.5 bg-[var(--surface-2)] border border-[var(--border)] rounded-lg text-[var(--text)] placeholder-[var(--text-faint)] focus:outline-none focus:ring-2 focus:ring-[var(--accent)]/50 focus:border-[var(--accent)] transition-colors"
                    placeholder="ایمیل خود را وارد کنید"
                    dir="ltr"
                    disabled={isSaving}
                  />
                </div>

                {/* Action Buttons */}
                <div className="flex items-center gap-3 pt-4 border-t border-[var(--border)]">
                  <button
                    onClick={handleSave}
                    disabled={isSaving}
                    className="flex items-center gap-2 px-6 py-2.5 bg-[var(--accent)] hover:bg-[var(--accent-press)] disabled:bg-[var(--accent)]/50 disabled:cursor-not-allowed text-[var(--bg)] font-medium rounded-lg transition-colors duration-200 shadow-md"
                  >
                    {isSaving ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        ذخیره...
                      </>
                    ) : (
                      <>
                        <Save className="w-4 h-4" />
                        ذخیره تغییرات
                      </>
                    )}
                  </button>
                  <button
                    onClick={cancelEditing}
                    disabled={isSaving}
                    className="flex items-center gap-2 px-6 py-2.5 bg-[var(--surface-2)] hover:bg-[var(--surface-2)] disabled:opacity-50 disabled:cursor-not-allowed text-[var(--text-muted)] font-medium rounded-lg transition-colors duration-200"
                  >
                    <X className="w-4 h-4" />
                    انصراف
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
    </section>
  );
}
