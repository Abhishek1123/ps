import { MouseEvent, useState } from 'react';
import { useCheckOverflow } from '../../hooks/useCheckOverflow';
import { formatDate } from '../../utils/formatDate';
import Link from 'next/link';
import { Video } from '../../types';

type Props = {
  creator: Video['postedBy'];
  caption: string;
  createdAt: string | Date;
};

export function VideoFooter({ creator, caption, createdAt }: Props) {
  const [isTextExpanded, setIsTextExpanded] = useState(false);
  const { ref: textRef, isOverflow: isTextOverflow } =
    useCheckOverflow<HTMLDivElement>();

  const toggleTextExpend = (e: MouseEvent) => {
    e.stopPropagation();

    setIsTextExpanded((prev) => !prev);
  };

  return (
    <div className='absolute w-full bottom-0 left-0 px-4 pb-6 text-sm space-y-1 video-overlay-bg text-white'>
      <p className='opacity-90'>
        <Link
          onClick={(e) => e.stopPropagation()}
          href={`/profile/${creator._id}`}
          className='hover:underline font-bold'
        >
          {creator.userName}
        </Link>{' '}
        • <span className='italic text-xs'>{formatDate(createdAt)}</span>
      </p>

      <div
        className={`${isTextExpanded ? 'pb-7' : 'gap-4'} relative flex justify-between items-center opacity-90 transition-all`}
      >
        <p ref={textRef} className={`${isTextExpanded ? '' : 'line-clamp-1'}`}>
          {caption}
        </p>

        {isTextOverflow && (
          <button
            onClick={(e) => toggleTextExpend}
            className='text-nowrap px-2 py-1'
          >
            more
          </button>
        )}

        {isTextExpanded && (
          <button
            onClick={toggleTextExpend}
            className='text-nowrap px-2 py-1 ml-auto absolute bottom-0 right-0'
          >
            less
          </button>
        )}
      </div>
    </div>
  );
}
