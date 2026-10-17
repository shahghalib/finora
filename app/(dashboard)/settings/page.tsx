'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { useMe, useUpdateProfile, useUploadProfilePicture } from '@/hooks/use-settings-data';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from '@/components/ui/toast';
import { User, Pencil } from 'lucide-react';
import { PageContainer, PageHeader } from '@/components/page-shell';

const TABS = [
  { key: 'profile', label: 'Profile Details', icon: User },
];

export default function SettingsPage() {
  const { data: user, isLoading } = useMe();
  const updateProfile = useUpdateProfile();
  const uploadPicture = useUploadProfilePicture();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [activeTab, setActiveTab] = useState('profile');
  const [username, setUsername] = useState('');
  const [defaultCurrency, setDefaultCurrency] = useState('');
  // A newly chosen photo is only staged here (shown as a preview). It is
  // uploaded when the user clicks "Save Changes".
  const [pendingPicture, setPendingPicture] = useState<{ file: File; previewUrl: string } | null>(null);
  const previewUrlRef = useRef<string | null>(null);

  const discardPendingPicture = useCallback(() => {
    if (previewUrlRef.current) URL.revokeObjectURL(previewUrlRef.current);
    previewUrlRef.current = null;
    setPendingPicture(null);
  }, []);

  // Free the preview's memory if the user leaves the page without saving.
  useEffect(() => {
    return () => {
      if (previewUrlRef.current) URL.revokeObjectURL(previewUrlRef.current);
    };
  }, []);

  useEffect(() => {
    if (user) {
      setUsername(user.username);
      setDefaultCurrency(user.defaultCurrency);
    }
  }, [user]);

  const profileChanged =
    !!user && (username !== user.username || defaultCurrency !== user.defaultCurrency);
  const hasChanges = profileChanged || !!pendingPicture;
  const isSaving = uploadPicture.isPending || updateProfile.isPending;

  const handleSave = async () => {
    if (!user) return;

    // 1) Photo (only if a new one was chosen)
    if (pendingPicture) {
      try {
        await uploadPicture.mutateAsync(pendingPicture.file);
        discardPendingPicture(); // the saved picture is now part of the loaded profile
      } catch {
        toast.add({ title: 'Failed to upload picture', type: 'error' });
        return;
      }
    }

    // 2) Username / currency (only if they changed)
    if (profileChanged) {
      try {
        await updateProfile.mutateAsync({ username, defaultCurrency });
      } catch {
        toast.add({ title: 'Failed to update profile', type: 'error' });
        return;
      }
    }

    toast.add({ title: 'Profile updated', type: 'success' });
  };

  const handleCancel = () => {
    if (!user) return;
    setUsername(user.username);
    setDefaultCurrency(user.defaultCurrency);
    discardPendingPicture();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    e.target.value = ''; // lets the same file be chosen again later
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      toast.add({ title: 'Please select an image file', type: 'error' });
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      toast.add({ title: 'Image must be under 5MB', type: 'error' });
      return;
    }

    // Replace any previously staged photo, then show the new one as a preview.
    if (previewUrlRef.current) URL.revokeObjectURL(previewUrlRef.current);
    const previewUrl = URL.createObjectURL(file);
    previewUrlRef.current = previewUrl;
    setPendingPicture({ file, previewUrl });
  };

  return (
    <PageContainer>
      <PageHeader
        title="Settings"
        description="Manage your profile and account preferences."
      />

      <div>
        <div className="mx-auto w-full max-w-2xl">
          <div className="rounded-xl border border-border bg-card p-4 shadow-sm sm:p-8">
            {activeTab === 'profile' && (
              <>
                <div className="mb-6">
                  <h2 className="card-title">Profile Details</h2>
                  <p className="text-sm text-muted-foreground mt-1">
                    Update your personal information and how others see you on the platform.
                  </p>
                </div>

                {isLoading ? (
                  <p className="text-muted-foreground text-sm">Loading...</p>
                ) : user ? (
                  <div className="space-y-6 sm:max-w-md">
                    {/* Profile picture */}
                    <div>
                      <p className="text-sm font-medium mb-3">Profile Picture</p>
                      <div className="flex items-center gap-4">
                        <div className="relative h-16 w-16 rounded-full overflow-hidden bg-[#EEEDE8] shrink-0">
                          {pendingPicture || user.profilePictureUrl ? (
                            // eslint-disable-next-line @next/next/no-img-element
                            <img
                              src={pendingPicture?.previewUrl ?? user.profilePictureUrl ?? ''}
                              alt="Profile"
                              className="h-full w-full object-cover"
                            />
                          ) : (
                            <div className="h-full w-full flex items-center justify-center text-lg font-semibold text-muted-foreground">
                              {user.username.charAt(0).toUpperCase()}
                            </div>
                          )}
                          <button
                            onClick={() => fileInputRef.current?.click()}
                            aria-label="Change profile picture"
                            className="absolute bottom-0 right-0 h-6 w-6 rounded-full bg-primary text-primary-foreground flex items-center justify-center border-2 border-white"
                          >
                            <Pencil className="h-3 w-3" />
                          </button>
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="text-xs text-muted-foreground mb-2">
                            PNG, JPG or GIF, under 5MB. A square image works best.
                          </p>
                          <div className="flex flex-wrap items-center gap-x-3 gap-y-2">
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => fileInputRef.current?.click()}
                              disabled={isSaving}
                            >
                              {pendingPicture ? 'Choose Different' : 'Change Photo'}
                            </Button>
                            {pendingPicture && (
                              <span className="text-xs font-medium text-amber-700">
                                New photo selected. Click Save Changes to apply it.
                              </span>
                            )}
                          </div>
                        </div>
                        <input
                          ref={fileInputRef}
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={handleFileChange}
                        />
                      </div>
                    </div>

                    <div>
                      <label className="text-sm font-medium mb-1.5 block">Username</label>
                      <Input value={username} onChange={(e) => setUsername(e.target.value)} />
                    </div>

                    <div>
                      <label className="text-sm font-medium mb-1.5 block">Email Address</label>
                      <Input value={user.email} readOnly className="cursor-not-allowed bg-muted/50" />
                      <p className="text-xs text-muted-foreground mt-1">Email changes aren&apos;t supported yet.</p>
                    </div>

                    <div>
                      <label className="text-sm font-medium mb-1.5 block">Default Currency</label>
                      <select
                        value={defaultCurrency}
                        onChange={(e) => setDefaultCurrency(e.target.value)}
                        className="h-10 w-full rounded-lg border border-input bg-transparent px-3 text-base sm:text-sm"
                      >
                        <option value="PKR">PKR</option>
                        <option value="USD">USD</option>
                        <option value="SAR">SAR</option>
                        <option value="GBP">GBP</option>
                      </select>
                    </div>

                    <div className="flex flex-wrap gap-3 border-t border-border pt-4">
                      <Button
                        className="h-10 px-5"
                        disabled={!hasChanges || isSaving}
                        onClick={handleSave}
                      >
                        {isSaving ? 'Saving...' : 'Save Changes'}
                      </Button>
                      {hasChanges && (
                        <Button variant="outline" className="h-10" onClick={handleCancel} disabled={isSaving}>
                          Cancel
                        </Button>
                      )}
                    </div>
                  </div>
                ) : (
                  <p className="text-sm text-muted-foreground">Unable to load profile.</p>
                )}
              </>
            )}
          </div>

          <nav
            aria-label="Help and legal"
            className="mt-4 flex flex-wrap justify-center gap-x-5 gap-y-1 text-xs text-muted-foreground"
          >
            <Link href="/help" className="transition-colors hover:text-foreground hover:underline">
              Help
            </Link>
            <Link href="/privacy" className="transition-colors hover:text-foreground hover:underline">
              Privacy Policy
            </Link>
            <Link href="/terms" className="transition-colors hover:text-foreground hover:underline">
              Terms of Service
            </Link>
          </nav>
        </div>
      </div>
    </PageContainer>
  );
}
