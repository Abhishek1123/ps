import Image from 'next/image';
import { Video } from '../types';
import { IoMdPause } from 'react-icons/io';
import { IoPlay } from 'react-icons/io5';
import { HiVolumeOff, HiVolumeUp } from 'react-icons/hi';
import { MouseEvent, useEffect, useRef, useState } from 'react';
interface Props {
  video: Video;
}

export default function VideoItem({
  video: { postedBy, caption, video },
}: Props) {
  const videoRef = useRef<HTMLVideoElement>(null);

  const [isPlaying, setIsPlaying] = useState(true);
  const [isMute, setIsMute] = useState(false);

  const handlePause = (e: MouseEvent) => {
    e.stopPropagation();
    const videoElem = videoRef.current!;

    if (!videoElem.paused) {
      videoElem.pause();
      setIsPlaying(false);
    } else {
      videoElem.play();
      setIsPlaying(true);
    }
  };

  const handleMute = (e: MouseEvent) => {
    e.stopPropagation();
    const videoElem = videoRef.current!;

    if (videoElem.muted) {
      videoElem.muted = false;
      setIsMute(false);
    } else {
      videoElem.muted = true;
      setIsMute(true);
    }
  };

  useEffect(() => {
    const videoElem = videoRef.current!;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          videoElem.play();
          setIsPlaying(true);
        } else {
          videoElem.pause();
          videoElem.currentTime = 0;
          setIsPlaying(false);
        }
      },
      { threshold: 0.5 }
    );

    observer.observe(videoElem);

    return () => observer.unobserve(videoElem);
  }, []);

  useEffect(() => setIsMute(videoRef.current!.muted), []);

  return (
    <div className='video-item pb-6 mb-6 border-b border-b-gray-200'>
      <header className='flex items-center xs:items-start mb-2 xs:mb-4'>
        <Image
          src={postedBy.image}
          width={100}
          height={100}
          alt='profile_img'
          className='w-10 h-10 xs:w-12 xs:h-12 rounded-full mr-2 xs:mr-3'
        />
        <div>
          <h2 className='font-bold mb-1 text-lg xs:text-base'>
            {postedBy.userName}
          </h2>
          <p className='max-w-md leading-[1.3rem] hidden xs:block'>{caption}</p>
        </div>
      </header>

      <p className='max-w-md leading-[1.3rem] mb-2 xs:hidden'>{caption}</p>

      <div
        onClick={handlePause}
        className='group relative rounded-md overflow-hidden cursor-pointer bg-black xs:ml-[60px] h-[497px] max-w-[280px] flex items-center'
      >
        <div className='w-full max-h-[500px]'>
          <video
            ref={videoRef}
            src={video.asset.url}
            loop
            muted
            className='w-full h-full object-cover object-center'
          />

          {/* action buttons */}
          <div className='absolute hidden group-hover:flex justify-between items-center left-0 right-0 bottom-7 px-4 text-white'>
            <>
              {isPlaying ? (
                <IoMdPause size={25} onClick={handlePause} />
              ) : (
                <IoPlay size={25} onClick={handlePause} />
              )}
            </>

            <>
              {isMute ? (
                <HiVolumeOff size={25} onClick={handleMute} />
              ) : (
                <HiVolumeUp size={25} onClick={handleMute} />
              )}
            </>
          </div>
        </div>
      </div>
    </div>
  );
}