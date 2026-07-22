'use client';

import { useEffect } from 'react';
import { recordPostViewAction, recordFeedViewsAction } from '@/app/actions';

interface ViewTrackerProps {
  postId?: string;
  feedPostIds?: string[];
}

export default function ViewTracker({ postId, feedPostIds }: ViewTrackerProps) {
  useEffect(() => {
    if (postId) {
      recordPostViewAction(postId);
    }
    if (feedPostIds && feedPostIds.length > 0) {
      recordFeedViewsAction(feedPostIds);
    }
  }, [postId, feedPostIds]);

  return null;
}
