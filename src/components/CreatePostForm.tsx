'use client';

import { useState, useTransition } from 'react';
import { createPostAction } from '@/app/actions';
import { Send, EyeOff, ShieldCheck, Image as ImageIcon, X } from 'lucide-react';

interface CreatePostFormProps {
  keepContent: boolean;
  username: string;
}

export default function CreatePostForm({ keepContent, username }: CreatePostFormProps) {
  const [content, setContent] = useState('');
  const [image, setImage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    setError(null);
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        setError('Image must be smaller than 2MB.');
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setImage(reader.result as string);
      };
      reader.onerror = () => {
        setError('Failed to read image file.');
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveImage = () => {
    setImage(null);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    if (!content.trim()) return;

    const formData = new FormData();
    formData.append('content', content);
    if (image) {
      formData.append('imageUrl', image);
    }

    startTransition(async () => {
      const res = await createPostAction(formData);
      if (res?.error) {
        setError(res.error);
      } else {
        setContent('');
        setImage(null);
      }
    });
  };

  const charCount = content.length;

  return (
    <div className="glass-panel rounded-2xl p-6 glow-indigo border border-white/5">
      <form onSubmit={handleSubmit} className="space-y-4" id="create-post-form">
        <div>
          <div className="flex items-center justify-between mb-2">
            <label htmlFor="post-content-input" className="text-xs font-bold uppercase tracking-wider text-text-muted">
              Share an idea, @{username}
            </label>
            <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${
              keepContent
                ? 'bg-purple-950/40 border border-purple-500/20 text-purple-300'
                : 'bg-amber-950/40 border border-amber-500/20 text-amber-300'
            }`}>
              {keepContent ? 'Post Immortalized (Anonymous in 24h)' : 'Post Expires in 24h'}
            </span>
          </div>
          <textarea
            id="post-content-input"
            rows={3}
            maxLength={300}
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Type your thought... What will survive you?"
            className="w-full bg-bg-dark/40 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent text-sm resize-none transition-all"
            disabled={isPending}
          />
        </div>

        {/* Image Selection and Preview */}
        <div className="space-y-3">
          {image && (
            <div className="relative inline-block">
              <img
                src={image}
                alt="Selected preview"
                className="max-h-24 w-auto rounded-lg border border-white/10 object-cover shadow-md"
              />
              <button
                type="button"
                onClick={handleRemoveImage}
                className="absolute -top-1.5 -right-1.5 p-1 bg-red-500 hover:bg-red-600 text-white rounded-full transition-colors cursor-pointer shadow-md flex items-center justify-center"
                title="Remove image"
              >
                <X className="w-3 h-3" />
              </button>
            </div>
          )}

          <div className="flex items-center gap-2">
            <label
              htmlFor="image-upload-input"
              className="inline-flex items-center gap-1.5 px-3 py-2 bg-white/5 border border-white/10 hover:bg-white/10 hover:border-white/20 text-white rounded-xl text-xs font-bold transition-all cursor-pointer select-none"
            >
              <ImageIcon className="w-3.5 h-3.5 text-accent" />
              <span>Attach Image (Optional)</span>
            </label>
            <input
              id="image-upload-input"
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="hidden"
              disabled={isPending}
            />
            {image && (
              <span className="text-[10px] text-emerald-400 font-bold bg-emerald-950/20 px-2 py-0.5 border border-emerald-500/20 rounded-md animate-pulse">
                Image Attached
              </span>
            )}
          </div>
        </div>

        {error && (
          <p className="text-xs text-red-400 font-medium" id="post-form-error">{error}</p>
        )}

        <div className="flex items-center justify-between">
          <div className="text-xs text-text-muted flex items-center gap-1.5 max-w-[70%]">
            {keepContent ? (
              <>
                <EyeOff className="w-3.5 h-3.5 text-purple-400 shrink-0" />
                <span>Identity fades in 24h, but your post is immortalized anonymously.</span>
              </>
            ) : (
              <>
                <ShieldCheck className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                <span>This post and your identity will be purged in 24h.</span>
              </>
            )}
          </div>

          <div className="flex items-center gap-3">
            <span className="text-xs text-text-muted font-mono">{charCount}/300</span>
            <button
              id="submit-post-btn"
              type="submit"
              disabled={isPending || !content.trim()}
              className="inline-flex items-center gap-1.5 px-4.5 py-2.5 rounded-xl text-xs font-bold text-white bg-accent hover:bg-accent-hover transition-colors disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer shadow-md shadow-accent/10 focus:outline-none"
            >
              <Send className="w-3.5 h-3.5" />
              <span>{isPending ? 'Broadcasting...' : 'Broadcast'}</span>
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
